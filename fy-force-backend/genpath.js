import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import db from '../config/db.js';

const ia = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// =================================================================
// 0. GENERER UNE LECON COMPLÈTE AVEC GEMINI (IA) ET RENVOYER LE DETAIL
// =================================================================
export const generateLesson = async (req, res) => {
  const { theme } = req.body;

  if (!theme) {
    return res.status(400).json({ message: "Le thème est obligatoire." });
  }

  const prompt = `
    Génère un cours sur le thème "${theme}". 
    Retourne un tableau d'objets JSON représentant les modules. 
    Chaque module contient un "nom", un "contenu", un "niveau_difficulte" (Entre 1 et 5) et un objet "quiz".
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
                { "option": "Choix A", "correct": true },
                { "option": "Choix B", "correct": false }
              ]
            }
          ]
        }
      }
    ]
  `;

  let connexion;
  try {
    // 1. Génération via Gemini
    const reponse = await ia.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const modules_json = JSON.parse(reponse.text);

    // 2. Connexion et Transaction SQL
    connexion = await db.getConnection();
    await connexion.beginTransaction();

    // 3. Insertion de la leçon
    const [lec] = await connexion.execute(
      'INSERT INTO LECON (NOM_LECON, TERMINE) VALUES (?, 0)',
      [theme]
    );
    const idLecon = lec.insertId;

    // Structure enrichie pour la réponse finale
    const createdModules = [];

    // 4. Parcourir et insérer chaque module
    for (const m of modules_json) {
      const [repModule] = await connexion.execute(
        'INSERT INTO MODULE (NOM_MODULE, CONTENU_MODULE, NIVEAU_MODULE, FINI) VALUES (?, ?, ?, 0)',
        [m.nom, m.contenu, m.niveau_difficulte]
      );
      const idModule = repModule.insertId;

      await connexion.execute(
        'INSERT INTO REGROUPER (ID_LECON, ID_MODULE) VALUES (?, ?)',
        [idLecon, idModule]
      );

      // Insertion Quiz
      const [repQuiz] = await connexion.execute(
        'INSERT INTO QUIZ (TITRE_QUIZ) VALUES (?)',
        [m.quiz.titre]
      );
      const idQuiz = repQuiz.insertId;

      await connexion.execute(
        'INSERT INTO GENERER (ID_MODULE, ID_QUIZ) VALUES (?, ?)',
        [idModule, idQuiz]
      );

      const createdQuestions = [];

      // Insertion Questions
      for (const q of m.quiz.questions) {
        const [repQuestion] = await connexion.execute(
          'INSERT INTO QUESTION (LIBELLE_QUESTION) VALUES (?)',
          [q.libelle]
        );
        const idQuestion = repQuestion.insertId;

        await connexion.execute(
          'INSERT INTO UTILISER (ID_QUESTION, ID_QUIZ) VALUES (?, ?)',
          [idQuestion, idQuiz]
        );

        const createdAnswers = [];

        // Insertion Réponses
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

          createdAnswers.push({
            ID_REPONSE: idReponse,
            OPTION: r.option,
            CORRECT: r.correct
          });
        }

        createdQuestions.push({
          ID_QUESTION: idQuestion,
          LIBELLE: q.libelle,
          REPONSES: createdAnswers
        });
      }

      createdModules.push({
        ID_MODULE: idModule,
        NOM_MODULE: m.nom,
        CONTENU_MODULE: m.contenu,
        NIVEAU_MODULE: m.niveau_difficulte,
        QUIZ: {
          ID_QUIZ: idQuiz,
          TITRE_QUIZ: m.quiz.titre,
          QUESTIONS: createdQuestions
        }
      });
    }

    await connexion.commit();

    // Réponse complète renvoyée au client
    res.status(201).json({
      message: "Leçon générée et insérée avec succès !",
      data: {
        ID_LECON: idLecon,
        NOM_LECON: theme,
        MODULES: createdModules
      }
    });

  } catch (erreur) {
    if (connexion) await connexion.rollback();
    res.status(500).json({ error: erreur.message });
  } finally {
    if (connexion) connexion.release();
  }
};

// =================================================================
// 2. RECUPERER UNE LECON + SES MODULES ET LEURS QUIZ
// =================================================================
export const getLessonWithModules = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer la leçon
    const [lessons] = await db.execute('SELECT * FROM LECON WHERE ID_LECON = ?', [id]);
    if (lessons.length === 0) {
      return res.status(404).json({ message: "Leçon non trouvée" });
    }

    // Récupérer les modules de la leçon
    const [modules] = await db.execute(`
      SELECT M.* 
      FROM MODULE M
      JOIN REGROUPER R ON M.ID_MODULE = R.ID_MODULE
      WHERE R.ID_LECON = ?
    `, [id]);

    // Pour chaque module, récupérer le quiz complet (Questions + Réponses)
    const modulesWithQuiz = await Promise.all(
      modules.map(async (mod) => {
        const [quizRows] = await db.execute(`
          SELECT Q.ID_QUIZ, Q.TITRE_QUIZ 
          FROM QUIZ Q
          JOIN GENERER G ON Q.ID_QUIZ = G.ID_QUIZ
          WHERE G.ID_MODULE = ?
        `, [mod.ID_MODULE]);

        let quizData = null;

        if (quizRows.length > 0) {
          const quiz = quizRows[0];

          // Récupérer les questions du quiz
          const [questions] = await db.execute(`
            SELECT Q.ID_QUESTION, Q.LIBELLE_QUESTION
            FROM QUESTION Q
            JOIN UTILISER U ON Q.ID_QUESTION = U.ID_QUESTION
            WHERE U.ID_QUIZ = ?
          `, [quiz.ID_QUIZ]);

          // Pour chaque question, récupérer les réponses
          const questionsWithAnswers = await Promise.all(
            questions.map(async (q) => {
              const [reponses] = await db.execute(`
                SELECT R.ID_REPONSE, R.LIBELLE_REPONSE, C.CORRECT
                FROM REPONSE R
                JOIN CORRESPONDRE C ON R.ID_REPONSE = C.ID_REPONSE
                WHERE C.ID_QUESTION = ?
              `, [q.ID_QUESTION]);

              return {
                ID_QUESTION: q.ID_QUESTION,
                LIBELLE_QUESTION: q.LIBELLE_QUESTION,
                REPONSES: reponses
              };
            })
          );

          quizData = {
            ID_QUIZ: quiz.ID_QUIZ,
            TITRE_QUIZ: quiz.TITRE_QUIZ,
            QUESTIONS: questionsWithAnswers
          };
        }

        return {
          ...mod,
          QUIZ: quizData
        };
      })
    );

    res.status(200).json({
      message: "Détails de la leçon",
      data: {
        ...lessons[0],
        MODULES: modulesWithQuiz
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =================================================================
// 3. RECUPERER UN MODULE PRECIS + SON CONTENU + QUIZ COMPLET
// =================================================================
export const getModuleDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [modules] = await db.execute('SELECT * FROM MODULE WHERE ID_MODULE = ?', [id]);
    if (modules.length === 0) {
      return res.status(404).json({ message: "Module non trouvé" });
    }

    // Récupérer le quiz du module
    const [quizRows] = await db.execute(`
      SELECT Q.ID_QUIZ, Q.TITRE_QUIZ 
      FROM QUIZ Q
      JOIN GENERER G ON Q.ID_QUIZ = G.ID_QUIZ
      WHERE G.ID_MODULE = ?
    `, [id]);

    let quizData = null;

    if (quizRows.length > 0) {
      const quiz = quizRows[0];

      const [questions] = await db.execute(`
        SELECT Q.ID_QUESTION, Q.LIBELLE_QUESTION
        FROM QUESTION Q
        JOIN UTILISER U ON Q.ID_QUESTION = U.ID_QUESTION
        WHERE U.ID_QUIZ = ?
      `, [quiz.ID_QUIZ]);

      const questionsWithAnswers = await Promise.all(
        questions.map(async (q) => {
          const [reponses] = await db.execute(`
            SELECT R.ID_REPONSE, R.LIBELLE_REPONSE, C.CORRECT
            FROM REPONSE R
            JOIN CORRESPONDRE C ON R.ID_REPONSE = C.ID_REPONSE
            WHERE C.ID_QUESTION = ?
          `, [q.ID_QUESTION]);

          return {
            ID_QUESTION: q.ID_QUESTION,
            LIBELLE_QUESTION: q.LIBELLE_QUESTION,
            REPONSES: reponses
          };
        })
      );

      quizData = {
        ID_QUIZ: quiz.ID_QUIZ,
        TITRE_QUIZ: quiz.TITRE_QUIZ,
        QUESTIONS: questionsWithAnswers
      };
    }

    res.status(200).json({
      message: "Détails du module avec quiz",
      data: {
        ...modules[0],
        QUIZ: quizData
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};