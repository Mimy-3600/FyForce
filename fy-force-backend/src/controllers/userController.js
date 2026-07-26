import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js'; // Ajuste le chemin selon ton projet

const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_securisee';

// --- REGISTER (INSCRIPTION) ---
export const create = async (req, res) => {
  try {
    const { EMAIL_USER, NOM_USER, PRENOM_USER, PASSWORD_USER } = req.body;

    // 1. Validation basique des champs obligatoires
    if (!EMAIL_USER || !PASSWORD_USER || !NOM_USER || !PRENOM_USER) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    // 2. Vérifier si l'utilisateur existe déjà
    const [existingUser] = await db.query(
      "SELECT EMAIL_USER FROM USER WHERE EMAIL_USER = ?",
      [EMAIL_USER]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // 3. Récupérer le chemin de la photo uploadée par Multer (s'il y en a une)
    const photoPath = req.file ? req.file.path.replace(/\\/g, '/') : null;

    // 4. Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(PASSWORD_USER, saltRounds);

    // 5. Insertion dans la base de données
    const query = `
      INSERT INTO USER (EMAIL_USER, NOM_USER, PRENOM_USER, PHOTO_USER, PASSWORD_USER) 
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      EMAIL_USER,
      NOM_USER,
      PRENOM_USER,
      photoPath,
      hashedPassword
    ]);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      data: {
        EMAIL_USER,
        NOM_USER,
        PRENOM_USER,
        PHOTO_USER: photoPath
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- LOGIN (CONNEXION) ---
export const login = async (req, res) => {
  try {
    const { EMAIL_USER, PASSWORD_USER } = req.body;

    if (!EMAIL_USER || !PASSWORD_USER) {
      return res.status(400).json({ message: "Veuillez fournir l'email et le mot de passe." });
    }

    // 1. Recherche de l'utilisateur par email
    const [rows] = await db.query(
      "SELECT * FROM USER WHERE EMAIL_USER = ?",
      [EMAIL_USER]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const user = rows[0];

    // 2. Vérification du mot de passe haché
    const isPasswordValid = await bcrypt.compare(PASSWORD_USER, user.PASSWORD_USER);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    // 3. Génération du Token JWT
    const token = jwt.sign(
      { email: user.EMAIL_USER },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "Connexion réussie !",
      token,
      user: {
        EMAIL_USER: user.EMAIL_USER,
        NOM_USER: user.NOM_USER,
        PRENOM_USER: user.PRENOM_USER,
        PHOTO_USER: user.PHOTO_USER
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const { id } = req.params; // L'id correspond à EMAIL_USER
    const query = "SELECT * FROM USER WHERE EMAIL_USER = ?";
    
    const [rows] = await db.query(query, [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: `Fetch de l'utilisateur ${id} réussi`,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const query = "SELECT * FROM USER";
    const [rows] = await db.query(query);

    res.status(200).json({
      message: "Fetch de tous les utilisateurs réussi",
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { NOM_USER, PRENOM_USER, PHOTO_USER, PASSWORD_USER } = req.body;

    const query = `
      UPDATE USER 
      SET NOM_USER = ?, PRENOM_USER = ?, PHOTO_USER = ?, PASSWORD_USER = ?
      WHERE EMAIL_USER = ?
    `;

    const [result] = await db.query(query, [NOM_USER, PRENOM_USER, PHOTO_USER, PASSWORD_USER, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé ou aucune modification apportée" });
    }

    res.status(200).json({ 
      message: "Mise à jour réussie"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM USER WHERE EMAIL_USER = ?";

    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Suppression réussie" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};