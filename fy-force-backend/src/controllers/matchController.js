import db from "../config/db.js"; 

// 1. Défier un user : Création du MATCH (auto-increment) + Inscription des 2 joueurs sans vainqueur
export const createMatch = async (req, res) => {
  try {
    const { USER_1, ARTEFACT_1, USER_2, ARTEFACT_2 } = req.body;

    // Insertion dans MATCH (L'ID_MATCH sera généré en AUTO_INCREMENT par MySQL)
    const [matchResult] = await db.query("INSERT INTO `MATCH` VALUES ()");
    const idMatch = matchResult.insertId;

    // Inscription des deux joueurs (PV initialisés à 100, GAGNER = FALSE)
    await db.query(
      "INSERT INTO PARTICIPER (EMAIL_USER, ID_MATCH, ID_ARTEFACT, PV_USER, GAGNER) VALUES (?, ?, ?, 100, FALSE)",
      [USER_1, idMatch, ARTEFACT_1]
    );

    await db.query(
      "INSERT INTO PARTICIPER (EMAIL_USER, ID_MATCH, ID_ARTEFACT, PV_USER, GAGNER) VALUES (?, ?, ?, 100, FALSE)",
      [USER_2, idMatch, ARTEFACT_2]
    );

    res.status(201).json({
      message: "Match créé avec succès ! En attente du résultat.",
      data: { ID_MATCH: idMatch, USER_1, USER_2 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Définir et appliquer le résultat du gagnant
export const determineWinner = async (req, res) => {
    try {
      const { ID_MATCH, WINNER_EMAIL, LOSER_EMAIL, REWARD_ARTEFACT } = req.body;

      // a. Marquer le gagnant et le perdant dans PARTICIPER
      await db.query(
        "UPDATE PARTICIPER SET GAGNER = TRUE, PV_USER = 100 WHERE ID_MATCH = ? AND EMAIL_USER = ?",
        [ID_MATCH, WINNER_EMAIL]
      );
      await db.query(
        "UPDATE PARTICIPER SET GAGNER = FALSE, PV_USER = 0 WHERE ID_MATCH = ? AND EMAIL_USER = ?",
        [ID_MATCH, LOSER_EMAIL]
      );

      // b. Enregistrer la récompense associée au match dans DONNER
      await db.query(
        "INSERT INTO DONNER (ID_MATCH, ID_ARTEFACT) VALUES (?, ?)",
        [ID_MATCH, REWARD_ARTEFACT]
      );

      // c. Transférer l'artefact remporté (Retrait du perdant + Ajout au gagnant)
      await db.query(
        "DELETE FROM POSSEDER WHERE EMAIL_USER = ? AND ID_ARTEFACT = ?",
        [LOSER_EMAIL, REWARD_ARTEFACT]
      );
      await db.query(
        "INSERT INTO POSSEDER (EMAIL_USER, ID_ARTEFACT) VALUES (?, ?)",
        [WINNER_EMAIL, REWARD_ARTEFACT]
      );

      res.status(200).json({
        message: `Le vainqueur ${WINNER_EMAIL} a été désigné et a reçu l'artefact ${REWARD_ARTEFACT} !`
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// 3. Voir les résultats d'un match
export const getMatchResult = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT P.EMAIL_USER, P.PV_USER, P.GAGNER, A.STAT_ARTEFACT, T.LIBELLE_ARTEFACT
      FROM PARTICIPER P
      JOIN ARTEFACT A ON P.ID_ARTEFACT = A.ID_ARTEFACT
      LEFT JOIN TYPE_ARTEFACT T ON A.CODE_ARTEFACT = T.CODE_ARTEFACT
      WHERE P.ID_MATCH = ?
    `;
    const [rows] = await db.query(query, [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Match non trouvé" });
    }

    res.status(200).json({
      message: `Statut du match ${id} récupéré`,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer le nombre de matches gagnés, perdus et total pour un utilisateur
export const getUserMatchStats = async (req, res) => {
  try {
    const { email } = req.params;

    const query = `
      SELECT 
        COUNT(*) AS TOTAL_MATCHES,
        SUM(CASE WHEN GAGNER = TRUE THEN 1 ELSE 0 END) AS MATCHES_GAGNES,
        SUM(CASE WHEN GAGNER = FALSE THEN 1 ELSE 0 END) AS MATCHES_PERDUS
      FROM PARTICIPER
      WHERE EMAIL_USER = ?
    `;

    const [rows] = await db.query(query, [email]);

    res.status(200).json({
      message: `Statistiques de matches pour ${email} récupérées avec succès`,
      data: {
        EMAIL_USER: email,
        TOTAL_MATCHES: Number(rows[0].TOTAL_MATCHES) || 0,
        MATCHES_GAGNES: Number(rows[0].MATCHES_GAGNES) || 0,
        MATCHES_PERDUS: Number(rows[0].MATCHES_PERDUS) || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer le classement des utilisateurs par nombre de victoires (Gestion Ex-Aequo)
export const getLeaderboardVictory = async (req, res) => {
  try {
    const query = `
      SELECT 
        U.EMAIL_USER,
        U.NOM_USER,
        U.PRENOM_USER,
        SUM(CASE WHEN P.GAGNER = TRUE THEN 1 ELSE 0 END) AS VICTOIRES,
        SUM(CASE WHEN P.GAGNER = FALSE THEN 1 ELSE 0 END) AS DEFAITES,
        COUNT(P.ID_MATCH) AS TOTAL_MATCHES
      FROM USER U
      LEFT JOIN PARTICIPER P ON U.EMAIL_USER = P.EMAIL_USER
      GROUP BY U.EMAIL_USER, U.NOM_USER, U.PRENOM_USER
      ORDER BY VICTOIRES DESC, DEFAITES ASC;
    `;

    const [rows] = await db.query(query);

    // Calcul dynamique du rang avec gestion des ex-æquo
    let currentRank = 1;
    const leaderboard = rows.map((user, index) => {
      const victoires = Number(user.VICTOIRES);
      const defaites = Number(user.DEFAITES);

      if (index > 0) {
        const prevUser = rows[index - 1];
        const prevVictoires = Number(prevUser.VICTOIRES);
        const prevDefaites = Number(prevUser.DEFAITES);

        // Si victoires et défaites sont identiques, ils gardent le même rang (Ex-æquo)
        if (victoires !== prevVictoires || defaites !== prevDefaites) {
          currentRank = index + 1;
        }
      }

      return {
        RANG: currentRank,
        EMAIL_USER: user.EMAIL_USER,
        NOM_USER: user.NOM_USER,
        PRENOM_USER: user.PRENOM_USER,
        VICTOIRES: victoires,
        DEFAITES: defaites,
        TOTAL_MATCHES: Number(user.TOTAL_MATCHES)
      };
    });

    res.status(200).json({
      message: "Classement des utilisateurs récupéré avec succès",
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};