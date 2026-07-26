import {GoogleGenAI} from '@google/genai'
import mysql from 'mysql2/promise';

const base = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'FY_FORCE'
})

const ia = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generer(theme){
    const connexion = await base.getConnection();
    //let prompt = `organise un path a suivre en regroupant les pas a suivre par modules, des quiz avec des questions et reponses en etudiant le javascript`
    let prompt = `
    Génère un cours sur le thème "${theme}". 
    Retourne un tableau d'objets JSON représentant les modules. 
    Chaque module contient un "nom", un "contenu", et un objet "quiz".
    L'objet "quiz" doit avoir un "titre" et un tableau "questions".
    Chaque question a un "libelle" et un tableau "reponse".
    Chaque reponse a une "option" (texte) et un booléen "correct".

    Structure JSON attendue :
    [
      {
        "nom": "Introduction au routage",
        "contenu": "Texte explicatif...",
        "quiz": {
          "titre": "Quiz Routage",
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
try{
    const reponse = await ia.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {responseMimeType: "application/json"}
    });
    console.log(reponse.text);
    const modules_json = JSON.parse(reponse.text);
    console.log(theme);
    await connexion.beginTransaction();
   const [lec] = await connexion.execute(
        'INSERT INTO LECON (NOM_LECON, TERMINE) VALUES (?,?)',
        [theme, 0]
    );
    const idLecon =  lec.insertId;

    for (const m of modules_json) {
         const [repModule] = await connexion.execute(
        'INSERT INTO MODULE (NOM_MODULE, CONTENU_MODULE, FINI) VALUES (?, ?, 0)',
        [m.nom, m.contenu]
      );
        const idModule = repModule.insertId;

        await connexion.execute(
            'INSERT INTO REGROUPER(ID_LECON, ID_MODULE) VALUES (?,?)',
            [idLecon, idModule]
        )

        const [repQuiz] = await connexion.execute(
            'INSERT INTO QUIZ (TITRE_QUIZ) VALUES (?)',
            [m.quiz.titre]
        );

        const idQuiz = repQuiz.insertId;

        await connexion.execute(
            'INSERT INTO GENERER (ID_MODULE, ID_QUIZ) VALUES (?,?)',
            [idModule, idQuiz]
        );


        for (const q of m.quiz.questions){
            const [repQuestion] = await connexion.execute(
                'INSERT INTO QUESTION (LIBELLE_QUESTION) VALUES (?)',
                [q.libelle]
            );
            const idQuestion = repQuestion.insertId;

            await connexion.execute(
                'INSERT INTO UTILISER(ID_QUESTION, ID_QUIZ) VALUES (?,?)',
                [idQuestion, idQuiz]
            );

            for (const r of q.reponse){
                const [answer] = await connexion.execute(
                    'INSERT INTO REPONSE(LIBELLE_REPONSE) VALUES (?)',
                    [r.option]
                );
                const idReponse = answer.insertId;

                connexion.execute(
                    'INSERT INTO CORRESPONDRE(ID_REPONSE, ID_QUESTION, CORRECT) VALUES (?,?,?)',
                    [idReponse, idQuestion, r.correct ? 1:0]
                );
            }
        }

    }
    await connexion.commit();
    console.log("Insertion reussie");

}catch(erreur){
    await connexion.rollback();
    console.log(erreur);
}finally{
    connexion.release();
}
}


generer("Apprendre le java");//ty soloina arakarak le atsofok le USER