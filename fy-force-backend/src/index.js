import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Middlewares Sécurité & Parser ---
app.use(cors()); 
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rendre le dossier uploads accessible publiquement (ex: http://localhost:3000/uploads/PHOTO_USER-123456.png)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Route de base ---
app.get('/', (req, res) => {
  res.json({ message: "Votre backend Node.js + MySQL est opérationnel !" });
});

// --- Chargement Dynamique des Routes ---
const routesDir = path.join(__dirname, 'routes');

if (fs.existsSync(routesDir)) {
  fs.readdirSync(routesDir).forEach(async (file) => {
    if (file.endsWith('Routes.js')) {
      const route = await import(`./routes/${file}`);
      const routeName = file.replace('Routes.js', '').toLowerCase();

      app.use(`/api/${routeName}`, route.default);
    }
  });
}

// --- Démarrage du Serveur ---
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});