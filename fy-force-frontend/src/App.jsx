import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import LeaderBoard from "./components/Leaderboard/LeaderBoard";
import Header from "./components/shared/Header";
import Path from "./views/Path";
import Inventory from "./components/Inventory/Inventory";
import GenPath from "./components/GeneratePath/GenPath";
import Footer from "./components/shared/Footer";
import Menu from "./components/Menu/Menu";

export default function App() {
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowWelcome(true);
  };

  // Minuteur de 3 secondes pour masquer le toast/bandeau d'accueil (sans déconnecter l'user)
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

      {/* Message de bienvenue temporaire après connexion */}
      {showWelcome && user && (
        <div className="glass-card" style={styles.welcomeCard}>
          <div className="auth-header">
            <h1 className="auth-title">Bienvenue, {user?.name || user?.email}</h1>
            <p className="auth-subtitle">Ravi de te revoir !</p>
          </div>
        </div>
      )}

      {/* Zone de contenu principale / Routes */}
      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/leaderBoard" element={<LeaderBoard />} />
          <Route path="/path" element={<Path />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/genPath" element={<GenPath />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

// Groupement des styles propres
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
  },
  welcomeCard: {
    textAlign: "center",
    padding: "1rem",
    margin: "1rem auto",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(8px)",
  },
};