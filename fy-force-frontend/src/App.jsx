import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Learning from "./components/Learning";

//Mock Data
const initialLessons = [
  {
    id: 1,
    title: "Apprendre Javascript",
    modules: [
      { id: 101, title: "Module 1: Tache 1", completed: false },
      { id: 102, title: "Module 2: Tache 2", completed: false } //vue actuelle
    ]
  },{
    id: 2,
    title: "Faire le projet C#",
    modules: [
      { id: 101, title: "Module 1: Tache 1", completed: false },
      { id: 102, title: "Module 2: Tache 2", completed: false } //vue actuelle
    ]
  },{
    id: 3,
    title: "Apprendre Java",
    modules: [
      { id: 101, title: "Module 1: Tache 1", completed: false },
      { id: 102, title: "Module 2: Tache 2", completed: false } //vue actuelle
    ]
  }
];
import LeaderBoard from "./components/Leaderboard/LeaderBoard";
import Header from "./components/shared/Header";
import Path from "./views/Path";
import Inventory from "./components/Inventory/Inventory";

// Composants temporaires pour éviter les erreurs si les fichiers n'existent pas encore
const Home = () => <div>Page d'accueil</div>;

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('welcome');
  };

  // Minuteur de 1 seconde pour le message d'accueil
  useEffect(() => {
    if (currentView === 'welcome') {
      const timer = setTimeout(() => {
        setCurrentView('learning');
        setShowWelcome(false);
      }, 3000);

      return () => clearTimeout(timer);
        setUser(null);
      }, 1000);
      return ()=> clearTimeout(timer);
    }
  }, [currentView]);

  return (
    <div style={styles.container}>
      <Header />
    <main style={styles.container}>
      {currentView === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess}/>
      )}

      {currentView === 'welcome' && (
    <main >
        {/* <Header/> */}

      {/* Message de bienvenue temporaire après connexion */}
      {showWelcome && user && (
      {/* Affichage du message de bienvenue ou du formulaire*/}
      {showWelcome ? (
        <div className="glass-card" style={styles.welcomeCard}>
          <div className="auth-header">
            <h1 className="auth-title">Bienvenue, {user?.name || user?.email}</h1>
            <p className="auth-subtitle">Ravi de te revoir !</p>
          </div>
        </div>
      )}

      {currentView === 'learning' && (
        <Learning lessonsData={initialLessons} />
      )}
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )} */}

      {/* Configuration des routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderBoard" element={<LeaderBoard />} />
        <Route path="/path" element={<Path />}/>
        <Route path="/inventory" element={<Inventory />}/>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />}/>
      </Routes>
    </main>
  );
}

const styles = {
  loginContainer: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'var(--bg-primary)', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    color: '#f9fafb',
  },
  
  learningContainer: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'var(--bg-primary)', 
    padding: '2rem',
    color: '#f9fafb',
  container: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "var(--bg-primary, #090d16)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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