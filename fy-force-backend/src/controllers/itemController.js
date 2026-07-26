import db from "../config/db.js"; 
export const getAll = async (req, res) => {
  try {
    const { email } = req.params;
    const query = `
      SELECT I.ID_ITEM, I.NOM_ITEM 
      FROM ITEM I
      JOIN RECEVOIR R ON I.ID_ITEM = R.ID_ITEM
      WHERE R.EMAIL_USER = ?
    `;
    const [rows] = await db.query(query, [email]);

    res.status(200).json({
      message: `Inventaire d'items de ${email} récupéré avec succès`,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un seul item par son ID
export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM ITEM WHERE ID_ITEM = ?";
    const [rows] = await db.query(query, [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Item non trouvé" });
    }

    res.status(200).json({
      message: `Fetch de l'item ${id} réussi`,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un item dans le catalogue
export const create = async (req, res) => {
  try {
    const { NOM_ITEM } = req.body;
    const query = "INSERT INTO ITEM (NOM_ITEM) VALUES (?)";
    const [result] = await db.query(query, [NOM_ITEM]);

    res.status(201).json({
      message: "Item créé avec succès",
      data: { ID_ITEM: result.insertId, NOM_ITEM }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};