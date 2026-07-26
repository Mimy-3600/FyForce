import { useState, useEffect } from "react";
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

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('welcome');
  };

  // timer 1s
  useEffect(() => {
    if (currentView === 'welcome') {
      const timer = setTimeout(() => {
        setCurrentView('learning');
      }, 1000);
      return ()=> clearTimeout(timer);
    }
  }, [currentView]);

  return (
    <main style={styles.container}>
      {currentView === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess}/>
      )}

      {currentView === 'welcome' && (
        <div className="glass-card" style={styles.welcomeCard}>
          <div className="auth-header">
            <h1 className="auth-title">Bienvenue, {user?.name}</h1>
            <p className="auth-subtitle">Identifiant : {user?.email}</p>
          </div>
        </div>
      )}

      {currentView === 'learning' && (
        <Learning lessonsData={initialLessons} />
      )}
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
  },
  welcomeCard: {
    textAlign: 'center'
  }
};