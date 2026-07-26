import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import db from '../config/db.js'; 

const ia = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// =================================================================
// 0. GENERER UNE LECON COMPLETA AVEC GEMINI (IA)
// =================================================================
export const generateLesson = async (req, res) => {
  const { theme } = req.body;

  if (!theme) {
    return res.status(400).json({ message: "Le thème est obligatoire." });
  }

  // Prompt pour forcer la structure JSON exacte avec les modules et quiz
  const prompt = `
    Génère un cours sur le thème "${theme}". 
    Retourne un tableau d'objets JSON représentant les modules. 
    Chaque module contient un "nom", un "contenu", un "niveau_difficulte" (Choisis seulement entre 1 et 5) et un objet "quiz".
    L'objet "quiz" doit avoir un "titre" et un tableau "questions".
    Chaque question a un "libelle" et un tableau "reponse".
    Chaque reponse a une "option" (texte) et un booléen "correct".

    Structure JSON attendue :
    [
      {
        "nom": "Introduction",
        "contenu": "Texte explicatif...",
        "niveau_difficulte": 1,
        "quiz": {
          "titre": "Quiz Intro",
          "questions": [
            {
              "libelle": "Question ?",
              "reponse": [
                { "option": "Choix A", "correct": true }
              ]
            }
          ]
        }
      }
    ]
  `;

  let connexion;
  try {
    // 1. Appel à l'API Gemini
    const reponse = await ia.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const modules_json = JSON.parse(reponse.text);

    // 2. Connexion et début de la transaction SQL unique
    connexion = await db.getConnection();
    await connexion.beginTransaction();

    // 3. Insertion de la leçon
    const [lec] = await connexion.execute(
      'INSERT INTO LECON (NOM_LECON, TERMINE) VALUES (?, 0)',
      [theme]
    );
    const idLecon = lec.insertId;

    // 4. Parcourir les modules générés
    for (const m of modules_json) {
      // 4a. Insertion du module
      const [repModule] = await connexion.execute(
        'INSERT INTO MODULE (NOM_MODULE, CONTENU_MODULE, NIVEAU_MODULE, FINI) VALUES (?, ?, ?, 0)',
        [m.nom, m.contenu, m.niveau_difficulte]
      );
      const idModule = repModule.insertId;

      // 4b. Liaison leçon <-> module (REGROUPER)
      await connexion.execute(
        'INSERT INTO REGROUPER (ID_LECON, ID_MODULE) VALUES (?, ?)',
        [idLecon, idModule]
      );

      // 4c. Insertion du quiz
      const [repQuiz] = await connexion.execute(
        'INSERT INTO QUIZ (TITRE_QUIZ) VALUES (?)',
        [m.quiz.titre]
      );
      const idQuiz = repQuiz.insertId;

      // 4d. Liaison module <-> quiz (GENERER)
      await connexion.execute(
        'INSERT INTO GENERER (ID_MODULE, ID_QUIZ) VALUES (?, ?)',
        [idModule, idQuiz]
      );

      // 5. Parcourir les questions du quiz
      for (const q of m.quiz.questions) {
        // 5a. Insertion de la question
        const [repQuestion] = await connexion.execute(
          'INSERT INTO QUESTION (LIBELLE_QUESTION) VALUES (?)',
          [q.libelle]
        );
        const idQuestion = repQuestion.insertId;

        // 5b. Liaison question <-> quiz (UTILISER)
        await connexion.execute(
          'INSERT INTO UTILISER (ID_QUESTION, ID_QUIZ) VALUES (?, ?)',
          [idQuestion, idQuiz]
        );

        // 6. Parcourir les réponses possibles
        for (const r of q.reponse) {
          // 6a. Insertion de la réponse
          const [answer] = await connexion.execute(
            'INSERT INTO REPONSE (LIBELLE_REPONSE) VALUES (?)',
            [r.option]
          );
          const idReponse = answer.insertId;

          // 6b. Liaison réponse <-> question (CORRESPONDRE)
          await connexion.execute(
            'INSERT INTO CORRESPONDRE (ID_REPONSE, ID_QUESTION, CORRECT) VALUES (?, ?, ?)',
            [idReponse, idQuestion, r.correct ? 1 : 0]
          );
        }
      }
    }

    // 7. Valider l'ensemble des requêtes (Transaction réussie)
    await connexion.commit();

    res.status(201).json({
      message: "Leçon générée et insérée avec succès !",
      data: { idLecon, theme, modulesCount: modules_json.length }
    });

  } catch (erreur) {
    // En cas d'erreur, on annule toutes les opérations
    if (connexion) await connexion.rollback();
    res.status(500).json({ error: erreur.message });
  } finally {
    // Libération de la connexion au pool
    if (connexion) connexion.release();
  }
};

// =================================================================
// 1. LISTER TOUTES LES LECONS
// =================================================================
export const getAllLessons = async (req, res) => {
  try {
    const [lessons] = await db.execute('SELECT * FROM LECON');
    res.status(200).json({ message: "Liste des leçons", data: lessons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =================================================================
// 2. RECUPERER UNE LECON + SES MODULES (JOIN REGROUPER)
// =================================================================
export const getLessonWithModules = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        L.ID_LECON, L.NOM_LECON, L.TERMINE,
        M.ID_MODULE, M.NOM_MODULE, M.NIVEAU_MODULE, M.FINI
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
        NIVEAU_MODULE: r.NIVEAU_MODULE,
        FINI: r.FINI
      })) : []
    };

    res.status(200).json({ message: "Détails de la leçon", data: lesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =================================================================
// 3. RECUPERER UN MODULE PRECIS
// =================================================================
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

// =================================================================
// 4. MARQUER UNE LECON COMME TERMINEE POUR UN USER (TRAVAILLER)
// =================================================================
export const completeLessonForUser = async (req, res) => {
  try {
    const { EMAIL_USER, ID_LECON } = req.body;

    const query = `
      INSERT INTO TRAVAILLER (EMAIL_USER, ID_LECON, TERMINE)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE TERMINE = 1;
    `;

    await db.execute(query, [EMAIL_USER, ID_LECON]);

    res.status(200).json({ message: "Leçon marquée comme terminée pour l'utilisateur." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =================================================================
// 5. MARQUER UN MODULE COMME FINI
// =================================================================
export const completeModule = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute('UPDATE MODULE SET FINI = 1 WHERE ID_MODULE = ?', [id]);

    res.status(200).json({ message: `Module ${id} marqué comme fini.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =================================================================
// 6. RECUPERER LA PROGRESSION D'UN USER
// =================================================================
export const getUserProgress = async (req, res) => {
  try {
    const { email } = req.params;

    const query = `
      SELECT 
        (SELECT COUNT(*) FROM LECON) AS TOTAL_LECONS,
        (SELECT COUNT(*) FROM TRAVAILLER WHERE EMAIL_USER = ? AND TERMINE = 1) AS LECONS_TERMINEES
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

// =================================================================
// 7. RECUPERER LE PROCHAIN MODULE NON TERMINE D'UNE LECON
// =================================================================
export const getNextUnfinishedModule = async (req, res) => {
  try {
    const { idLecon } = req.params;

    const query = `
      SELECT M.* 
      FROM MODULE M
      JOIN REGROUPER R ON M.ID_MODULE = R.ID_MODULE
      WHERE R.ID_LECON = ? AND M.FINI = 0
      ORDER BY M.NIVEAU_MODULE ASC, M.ID_MODULE ASC
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

// Récupérer la liste des leçons pour un utilisateur spécifique (avec son statut de progression)
export const getUserLessons = async (req, res) => {
  try {
    const { email } = req.params;

    const query = `
      SELECT 
        L.ID_LECON, 
        L.NOM_LECON, 
        IFNULL(T.TERMINE, 0) AS TERMINE
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