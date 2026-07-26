import db from "../config/db.js"; // Adapte le chemin vers ta connexion MySQL

// GET /api/user/:email/artefacts
export const getUserArtefacts = async (req, res) => {
  try {
    const { email } = req.params;
    const query = `
      SELECT A.ID_ARTEFACT, A.STAT_ARTEFACT, A.CODE_ARTEFACT
      FROM ARTEFACT A
      JOIN POSSEDER P ON A.ID_ARTEFACT = P.ID_ARTEFACT
      WHERE P.EMAIL_USER = ?
    `;
    const [artefacts] = await db.query(query, [email]);

    res.status(200).json({ message: "Inventaire d'artefacts récupéré", data: artefacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/artefact/craft
export const craftArtefact = async (req, res) => {
  try {
    const { EMAIL_USER, ID_ARTEFACT, ITEMS_REQUIRED } = req.body; // ITEMS_REQUIRED = [id1, id2, ...]

    // 1. Vérifier si l'utilisateur possède les items requis
    const [userItems] = await db.query(
      `SELECT ID_ITEM FROM RECEVOIR WHERE EMAIL_USER = ? AND ID_ITEM IN (?)`,
      [EMAIL_USER, ITEMS_REQUIRED]
    );

    if (userItems.length < ITEMS_REQUIRED.length) {
      return res.status(400).json({ message: "Items insuffisants pour le craft" });
    }

    // 2. Enregistrer le craft et attribuer l'artefact (POSSEDER)
    for (const idItem of ITEMS_REQUIRED) {
      await db.query(`INSERT INTO CRAFTER (ID_ARTEFACT, ID_ITEM) VALUES (?, ?)`, [ID_ARTEFACT, idItem]);
    }
    await db.query(`INSERT INTO POSSEDER (EMAIL_USER, ID_ARTEFACT) VALUES (?, ?)`, [EMAIL_USER, ID_ARTEFACT]);

    res.status(201).json({ message: "Craft réussi et artefact ajouté à l'inventaire !" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/module/drop
export const dropArtefactFromModule = async (req, res) => {
  try {
    const { EMAIL_USER, ID_MODULE, ID_ARTEFACT } = req.body;

    // Lier le drop au module et donner l'artefact à l'utilisateur
    await db.query(`INSERT INTO DROPPER (ID_MODULE, ID_ARTEFACT) VALUES (?, ?)`, [ID_MODULE, ID_ARTEFACT]);
    await db.query(`INSERT INTO POSSEDER (EMAIL_USER, ID_ARTEFACT) VALUES (?, ?)`, [EMAIL_USER, ID_ARTEFACT]);

    res.status(201).json({ message: "Module validé et artefact droppé avec succès !" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/artefact/:id/details
export const getArtefactDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT A.ID_ARTEFACT, A.STAT_ARTEFACT, A.CODE_ARTEFACT, T.LIBELLE_ARTEFACT 
      FROM ARTEFACT A
      LEFT JOIN TYPE_ARTEFACT T ON A.CODE_ARTEFACT = T.CODE_ARTEFACT
      WHERE A.ID_ARTEFACT = ?
    `;
    const [rows] = await db.query(query, [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Artefact non trouvé" });
    }

    res.status(200).json({ message: "Détails de l'artefact récupérés", data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/type-artefact
export const getAllArtefactTypes = async (req, res) => {
  try {
    const query = `SELECT * FROM TYPE_ARTEFACT`;
    const [rows] = await db.query(query);

    res.status(200).json({ message: "Liste des types d'artefacts récupérée", data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Échanger / Transférer un artefact d'un user à un autre
export const exchangeArtefact = async (req, res) => {
  try {
    const { SENDER_EMAIL, RECEIVER_EMAIL, ID_ARTEFACT } = req.body;

    // 1. Vérifier si l'expéditeur possède bien l'artefact
    const [ownership] = await db.query(
      "SELECT * FROM POSSEDER WHERE EMAIL_USER = ? AND ID_ARTEFACT = ?",
      [SENDER_EMAIL, ID_ARTEFACT]
    );

    if (!ownership || ownership.length === 0) {
      return res.status(404).json({ 
        message: "L'expéditeur ne possède pas cet artefact" 
      });
    }

    // 2. Transférer la propriété dans POSSEDER
    const queryUpdate = `
      UPDATE POSSEDER 
      SET EMAIL_USER = ? 
      WHERE EMAIL_USER = ? AND ID_ARTEFACT = ?
    `;
    await db.query(queryUpdate, [RECEIVER_EMAIL, SENDER_EMAIL, ID_ARTEFACT]);

    res.status(200).json({
      message: `Échange réussi ! L'artefact ${ID_ARTEFACT} a été transféré à ${RECEIVER_EMAIL}.`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};