import { useState, useEffect } from "react";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowWelcome(true);
  };

  // timer 1s
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
    <main style={styles.container}>
      {showWelcome ? (
        <div className="glass-card" style={styles.welcomeCard}>
          <div className="auth-header">
            <h1 className="auth-title">Bienvenue, {user?.name}</h1>
            <p className="auth-subtitle">Identifiant : {user?.email}</p>
          </div>
        </div>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </main>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'var(--bg-primary)', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    color: '#f9fafb',
    fontFamily: 'system-ui, sans-serif'
  },
  welcomeCard: {
    textAlign: 'center'
  }
};