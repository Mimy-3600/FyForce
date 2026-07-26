import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Learning from "./components/Learning";
import LeaderBoard from "./components/Leaderboard/LeaderBoard";
import Header from "./components/shared/Header";
import Path from "./views/Path";
import Inventory from "./components/Inventory/Inventory";
import GenPath from "./components/GeneratePath/GenPath";
import Menu from "./components/Menu/Menu";
import Craft from "./components/Craft/Craft";
import Home from "./views/Home";
import { saveSession, getCurrentUser } from "./services/auth"; // adapte le chemin si besoin

const initialLessons = [
  {
    id: 1,
    title: "Apprendre Javascript",
    modules: [
      { id: 101, title: "Module 1: Tache 1", completed: false },
      { id: 102, title: "Module 2: Tache 2", completed: false }
    ]
  },
  {
    id: 2,
    title: "Faire le projet C#",
    modules: [
      { id: 201, title: "Module 1: Tache 1", completed: false },
      { id: 202, title: "Module 2: Tache 2", completed: false }
    ]
  },
  {
    id: 3,
    title: "Apprendre Java",
    modules: [
      { id: 301, title: "Module 1: Tache 1", completed: false },
      { id: 302, title: "Module 2: Tache 2", completed: false }
    ]
  }
];

// Doit matcher la forme renvoyée par le backend mocké (login.js)
const MOCK_USER = {
  EMAIL_USER: "andry.paul@eni-fianar.mg",
  NOM_USER: "Paul",
  PRENOM_USER: "Andry",
  PHOTO_USER: null,
};
const MOCK_TOKEN = "mock-token-dev-only";

export default function App() {
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  // Réhydrate la session depuis le localStorage au chargement
  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowWelcome(true);
    navigate("/");
  };

  // Mock : simule une connexion réussie et la persiste dans le localStorage (dev uniquement)
  useEffect(() => {
    if (import.meta.env.DEV && !getCurrentUser()) {
      saveSession(MOCK_TOKEN, MOCK_USER);
      handleLoginSuccess(MOCK_USER);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  return (
    <div style={styles.container}>
      <Header />

      {showWelcome && user && (
        <div className="glass-card" style={styles.welcomeCard}>
          <div className="auth-header">
            <h1 className="auth-title">Bienvenue, {user?.PRENOM_USER || user?.EMAIL_USER}</h1>
            <p className="auth-subtitle">Ravi de te revoir !</p>
          </div>
        </div>
      )}

      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/learning/:idLesson" element={<Learning lessonsData={initialLessons} />} />
          <Route path="/leaderBoard" element={<LeaderBoard />} />
          <Route path="/path" element={<Path />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/genPath" element={<GenPath />} />
          <Route path="/craft" element={<Craft />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "var(--bg-primary, #090d16)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "#f9fafb",
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundImage: `
      radial-gradient(circle 300px at 40% 10%, #23335544, transparent),
      radial-gradient(circle 200px at 60% 20%, #2b203044, transparent),
      radial-gradient(circle 300px at bottom right, #23335544, transparent),
      radial-gradient(circle 400px at 0% 70%, #23335544, transparent)
    `,
    backgroundAttachment: "fixed",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "2rem",
  },
  welcomeCard: {
    textAlign: "center",
    padding: "2rem",
    margin: "1rem auto",
    maxWidth: "600px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  }
};