import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import db from '../config/db.js';

const ia = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Types d'artefacts autorisés
const TYPES_ARTEFACTS = ['EPEE', 'BOUCLIER', 'GRIMOIRE', 'AMULETTE'];

/**
 * Helper: Nombre d'artefacts (1 à 5) selon le niveau et la chance
 */
function getRandomArtefactCount(niveau) {
  const chanceBonus = Math.floor(Math.random() * niveau);
  const total = 1 + chanceBonus;
  return Math.min(Math.max(total, 1), 5);
}

// =================================================================
// 1. GENERER OU MODIFIER UN BROUILLON DE PLAN (AVEC MEMOIRE IA)
// =================================================================
export const generateLesson = async (req, res) => {
  const { theme, currentPlan, history } = req.body;

  if (!theme && !currentPlan) {
    return res.status(400).json({ message: "Le thème ou un plan actuel est obligatoire." });
  }

  // Construction du prompt avec l'historique et le plan en cours
  const systemContext = `
    Tu es un assistant pédagogique expert. 
    Ta mission est d'aider l'utilisateur à créer et personnaliser un parcours d'apprentissage.

    ${currentPlan ? `PLAN ACTUEL EN COURS DE MODIFICATION :
    ${JSON.stringify(currentPlan, null, 2)}` : ''}

    ${history && history.length > 0 ? `HISTORIQUE DE LA CONVERSATION :
    ${JSON.stringify(history, null, 2)}` : ''}

    CONSIGNES STRICTES :
    1. Si l'utilisateur demande une modification (ex: "ajoute un chapitre", "supprime la partie 2", "rend le cours plus difficile"), adapte le plan.
    2. Si l'utilisateur propose un nouveau sujet, génère un nouveau plan complet.
    3. Tu dois impérativement retourner un objet JSON valide structuré comme suit :

    {
      "theme": "${currentPlan?.theme || theme}",
      "modules": [
        {
          "nom": "Titre du module",
          "contenu": "Contenu explicatif détaillé du module...",
          "niveau_difficulte": 1,
          "quizzes": [
            {
              "titre": "Quiz d'évaluation",
              "questions": [
                {
                  "libelle": "Question du quiz ?",
                  "reponse": [
                    { "option": "Option A", "correct": true },
                    { "option": "Option B", "correct": false }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  `;

  try {
    const prompt = `Demande de l'utilisateur : "${theme}"`;

    const reponse = await ia.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        { role: 'user', parts: [{ text: systemContext + '\n' + prompt }] }
      ],
      config: { responseMimeType: "application/json" }
    });

    const planGenere = JSON.parse(reponse.text);

    // On renvoie simplement le plan généré au front SANS toucher à la BDD
    res.status(200).json({
      message: "Plan généré ou mis à jour avec succès !",
      data: planGenere
    });

  } catch (erreur) {
    console.error("Erreur Gemini:", erreur);
    res.status(500).json({ error: erreur.message });
  }
};


// Les libellés de type autorisés
const LIBELLES_ARTEFACTS = ['ATTAQUE', 'DEFENSE', 'CRAFT'];

/**
 * Helper: Génère 2 lettres aléatoires (ex: 'AB', 'XY')
 */
function getRandomLetters(length = 2) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}

/**
 * Helper: Génère un CODE_ARTEFACT unique
 * Format : NOM + 4 derniers chiffres timestamp ms + 2 lettres
 * Exemple : "EPEE9821XZ"
 */
function generateUniqueArtefactCode(nomPrefix = "ART") {
  // Nettoie le nom (garde uniquement les lettres sans espaces/accents)
  const cleanNom = nomPrefix.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 8) || "ART";
  
  // 4 derniers chiffres des millisecondes actuelles
  const last4Ms = Date.now().toString().slice(-4);
  
  // 2 lettres aléatoires
  const random2Letters = getRandomLetters(2);

  return `${cleanNom}${last4Ms}${random2Letters}`;
}

/**
 * Helper: Génération des stats et attributs d'un artefact
 */
function generateArtefactStats(moduleNom, niveau) {
  const randomLibelle = LIBELLES_ARTEFACTS[Math.floor(Math.random() * LIBELLES_ARTEFACTS.length)];
  const uniqueCode = generateUniqueArtefactCode(moduleNom || "ART");
  
  const baseStat = niveau * 15;
  const luckBonus = Math.floor(Math.random() * 15);

  return {
    code_artefact: uniqueCode,
    libelle_type: randomLibelle, // ATTAQUE, DEFENSE ou CRAFT
    stat: baseStat + luckBonus
  };
}


// =================================================================
// 2. SAUVEGARDER LE PARCOURS DÉFINITIF EN BDD (BOUTON VALIDER)
// =================================================================
export const saveCustomLesson = async (req, res) => {
  const { theme, modules, email_user } = req.body;

  if (!theme || !modules || !Array.isArray(modules)) {
    return res.status(400).json({ message: "Données de la leçon incomplètes." });
  }

  let connexion;
  try {
    connexion = await db.getConnection();
    await connexion.beginTransaction();

    // 1. Insertion de la Leçon
    const [lec] = await connexion.execute(
      'INSERT INTO LECON (NOM_LECON, TERMINE) VALUES (?, 0)',
      [theme]
    );
    const idLecon = lec.insertId;

    // 2. Gestion de l'utilisateur (Liaison Leçon + Item offert)
    if (email_user) {
      // 2a. Lier l'utilisateur à cette nouvelle leçon dans la table TRAVAILLER
      await connexion.execute(
        'INSERT IGNORE INTO TRAVAILLER (EMAIL_USER, ID_LECON) VALUES (?, ?)',
        [email_user, idLecon]
      );

      // 2b. Attribution de l'Item de fin/début de cours
      const [availableItems] = await connexion.execute(
        `SELECT ID_ITEM FROM ITEM 
         WHERE ID_ITEM NOT IN (SELECT ID_ITEM FROM RECEVOIR WHERE EMAIL_USER = ?)
         ORDER BY RAND() LIMIT 1`,
        [email_user]
      );

      if (availableItems.length > 0) {
        const itemToGive = availableItems[0].ID_ITEM;
        await connexion.execute(
          'INSERT IGNORE INTO RECEVOIR (ID_ITEM, EMAIL_USER) VALUES (?, ?)',
          [itemToGive, email_user]
        );
      }
    }

    // 3. Boucle sur les modules validés par l'utilisateur
    for (const m of modules) {
      const niveau = m.niveau_difficulte || 1;

      // 3a. Creation du Module
      const [repModule] = await connexion.execute(
        'INSERT INTO MODULE (NOM_MODULE, CONTENU_MODULE, FINI) VALUES (?, ?, 0)',
        [m.nom, m.contenu || "Contenu de la leçon"]
      );
      const idModule = repModule.insertId;

      // 3b. Liaison Leçon <-> Module (REGROUPER)
      await connexion.execute(
        'INSERT INTO REGROUPER (ID_LECON, ID_MODULE) VALUES (?, ?)',
        [idLecon, idModule]
      );

      // 3c. Génération des artefacts uniques
      const nbArtefacts = getRandomArtefactCount(niveau);

      for (let i = 0; i < nbArtefacts; i++) {
        const art = generateArtefactStats(m.nom, niveau);

        // 1. Assure la présence de la clé dans TYPE_ARTEFACT (clé primaire = CODE_ARTEFACT)
        await connexion.execute(
          'INSERT INTO TYPE_ARTEFACT (CODE_ARTEFACT, LIBELLE_ARTEFACT) VALUES (?, ?) ON DUPLICATE KEY UPDATE LIBELLE_ARTEFACT = VALUES(LIBELLE_ARTEFACT)',
          [art.code_artefact, art.libelle_type]
        );

        // 2. Insère l'artefact rattaché à son type unique
        const [repArt] = await connexion.execute(
          'INSERT INTO ARTEFACT (CODE_ARTEFACT, STAT_ARTEFACT) VALUES (?, ?)',
          [art.code_artefact, art.stat]
        );
        const idArtefact = repArt.insertId;

        // 3. Liaison Module <-> Artefact (DROPPER)
        await connexion.execute(
          'INSERT INTO DROPPER (ID_MODULE, ID_ARTEFACT) VALUES (?, ?)',
          [idModule, idArtefact]
        );
      }

      // 3d. Insertion des Quiz s'ils existent
      const quizzes = m.quizzes || (m.quiz ? [m.quiz] : []);
      for (const qz of quizzes) {
        const [repQuiz] = await connexion.execute(
          'INSERT INTO QUIZ (TITRE_QUIZ) VALUES (?)',
          [qz.titre || `Quiz - ${m.nom}`]
        );
        const idQuiz = repQuiz.insertId;

        await connexion.execute(
          'INSERT INTO GENERER (ID_MODULE, ID_QUIZ) VALUES (?, ?)',
          [idModule, idQuiz]
        );

        if (qz.questions && Array.isArray(qz.questions)) {
          for (const q of qz.questions) {
            const [repQuestion] = await connexion.execute(
              'INSERT INTO QUESTION (LIBELLE_QUESTION) VALUES (?)',
              [q.libelle]
            );
            const idQuestion = repQuestion.insertId;

            await connexion.execute(
              'INSERT INTO UTILISER (ID_QUESTION, ID_QUIZ) VALUES (?, ?)',
              [idQuestion, idQuiz]
            );

            if (q.reponse && Array.isArray(q.reponse)) {
              for (const r of q.reponse) {
                const [answer] = await connexion.execute(
                  'INSERT INTO REPONSE (LIBELLE_REPONSE) VALUES (?)',
                  [r.option]
                );
                const idReponse = answer.insertId;

                await connexion.execute(
                  'INSERT INTO CORRESPONDRE (ID_REPONSE, ID_QUESTION, CORRECT) VALUES (?, ?, ?)',
                  [idReponse, idQuestion, r.correct ? 1 : 0]
                );
              }
            }
          }
        }
      }
    }

    await connexion.commit();

    res.status(201).json({
      message: "Parcours et modules validés et enregistrés en base de données !",
      data: { idLecon, theme }
    });

  } catch (erreur) {
    if (connexion) await connexion.rollback();
    console.error("Erreur enregistrement :", erreur);
    res.status(500).json({ error: erreur.message });
  } finally {
    if (connexion) connexion.release();
  }
};

// =================================================================
// 3. RECUPERER LES QUIZ D'UN UTILISATEUR (getUserQuizzes)
// =================================================================
export const getUserQuizzes = async (req, res) => {
  try {
    const { email } = req.params;

    const query = `
      SELECT 
        Q.ID_QUIZ, 
        Q.TITRE_QUIZ, 
        M.ID_MODULE, 
        M.NOM_MODULE, 
        L.ID_LECON, 
        L.NOM_LECON
      FROM TRAVAILLER T
      JOIN LECON L ON T.ID_LECON = L.ID_LECON
      JOIN REGROUPER R ON L.ID_LECON = R.ID_LECON
      JOIN MODULE M ON R.ID_MODULE = M.ID_MODULE
      JOIN GENERER G ON M.ID_MODULE = G.ID_MODULE
      JOIN QUIZ Q ON G.ID_QUIZ = Q.ID_QUIZ
      WHERE T.EMAIL_USER = ?
    `;

    const [quizzes] = await db.execute(query, [email]);

    res.status(200).json({
      message: `Quiz trouvés pour l'utilisateur ${email}`,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =================================================================
// AUTRES FONCTIONS UTILITAIRES
// =================================================================
export const getAllLessons = async (req, res) => {
  try {
    const [lessons] = await db.execute('SELECT * FROM LECON');
    res.status(200).json({ message: "Liste des leçons", data: lessons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLessonWithModules = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        L.ID_LECON, L.NOM_LECON, L.TERMINE,
        M.ID_MODULE, M.NOM_MODULE, M.FINI
      FROM LECON L
      LEFT JOIN REGROUPER R ON L.ID_LECON = R.ID_LECON
      LEFT JOIN MODULE M ON R.ID_MODULE = M.ID_MODULE
      WHERE L.ID_LECON = ?
    `;

    const [rows] = await db.execute(query, [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Leçon non trouvée" });
    }

    const lesson = {
      ID_LECON: rows[0].ID_LECON,
      NOM_LECON: rows[0].NOM_LECON,
      TERMINE: rows[0].TERMINE,
      MODULES: rows[0].ID_MODULE ? rows.map(r => ({
        ID_MODULE: r.ID_MODULE,
        NOM_MODULE: r.NOM_MODULE,
        FINI: r.FINI
      })) : []
    };

    res.status(200).json({ message: "Détails de la leçon", data: lesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getModuleDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const [modules] = await db.execute('SELECT * FROM MODULE WHERE ID_MODULE = ?', [id]);

    if (modules.length === 0) {
      return res.status(404).json({ message: "Module non trouvé" });
    }

    res.status(200).json({ message: "Détails du module", data: modules[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeLessonForUser = async (req, res) => {
  try {
    const { EMAIL_USER, ID_LECON } = req.body;

    const query = `
      INSERT INTO TRAVAILLER (EMAIL_USER, ID_LECON)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE EMAIL_USER = EMAIL_USER;
    `;

    await db.execute(query, [EMAIL_USER, ID_LECON]);

    res.status(200).json({ message: "Leçon marquée comme terminée pour l'utilisateur." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeModule = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('UPDATE MODULE SET FINI = 1 WHERE ID_MODULE = ?', [id]);
    res.status(200).json({ message: `Module ${id} marqué comme fini.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const { email } = req.params;

    const query = `
      SELECT 
        (SELECT COUNT(*) FROM LECON) AS TOTAL_LECONS,
        (SELECT COUNT(*) FROM TRAVAILLER WHERE EMAIL_USER = ?) AS LECONS_TERMINEES
    `;

    const [rows] = await db.execute(query, [email]);
    const total = Number(rows[0].TOTAL_LECONS);
    const terminees = Number(rows[0].LECONS_TERMINEES);
    const pourcentage = total > 0 ? Math.round((terminees / total) * 100) : 0;

    res.status(200).json({
      message: "Progression de l'utilisateur",
      data: { TOTAL_LECONS: total, LECONS_TERMINEES: terminees, POURCENTAGE: `${pourcentage}%` }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNextUnfinishedModule = async (req, res) => {
  try {
    const { idLecon } = req.params;

    const query = `
      SELECT M.* 
      FROM MODULE M
      JOIN REGROUPER R ON M.ID_MODULE = R.ID_MODULE
      WHERE R.ID_LECON = ? AND M.FINI = 0
      ORDER BY M.ID_MODULE ASC
      LIMIT 1;
    `;

    const [rows] = await db.execute(query, [idLecon]);

    if (rows.length === 0) {
      return res.status(200).json({ message: "Tous les modules de cette leçon sont déjà terminés !" });
    }

    res.status(200).json({ message: "Prochain module à faire", data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserLessons = async (req, res) => {
  try {
    const { email } = req.params;

    const query = `
      SELECT 
        L.ID_LECON, 
        L.NOM_LECON, 
        IF(T.EMAIL_USER IS NOT NULL, 1, 0) AS TERMINE
      FROM LECON L
      LEFT JOIN TRAVAILLER T 
        ON L.ID_LECON = T.ID_LECON AND T.EMAIL_USER = ?
    `;

    const [lessons] = await db.execute(query, [email]);

    res.status(200).json({
      message: `Liste des leçons pour ${email}`,
      data: lessons
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};