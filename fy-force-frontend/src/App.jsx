import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import LeaderBoard from "./components/Leaderboard/LeaderBoard";
import Header from "./components/shared/Header";
import Path from "./views/Path";

// Composants temporaires pour éviter les erreurs si les fichiers n'existent pas encore
const Home = () => <div>Page d'accueil</div>;
const About = () => <div>À propos</div>;
const Contact = () => <div>Contact</div>;

export default function App() {
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowWelcome(true);
  };

  // Minuteur de 1 seconde pour le message d'accueil
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        setUser(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  return (
    <main >
        <Header/>

      {/* Affichage du message de bienvenue ou du formulaire
      {showWelcome ? (
        <div className="glass-card" style={styles.welcomeCard}>
          <div className="auth-header">
            <h1 className="auth-title">Bienvenue, {user?.name}</h1>
            <p className="auth-subtitle">Identifiant : {user?.email}</p>
          </div>
        </div>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )} */}

      {/* Configuration des routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderBoard" element={<LeaderBoard />} />
        <Route path="/path" element={<Path />}/>
      </Routes>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "var(--bg-primary)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    color: "#f9fafb",
    fontFamily: "system-ui, sans-serif",
  },
  welcomeCard: {
    textAlign: "center",
  },
  nav: {
    marginBottom: "1rem",
  },
};
