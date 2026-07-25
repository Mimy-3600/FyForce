import React, { useState } from "react";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pswd: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onLoginSuccess) {
      onLoginSuccess({
        name: formData.name || 'Utilisateur',
        email: formData.email
      });
    }
  };

  return (
    <div className="glass-card">
      <div className="auth-header">
        <h2 className="auth-title">
          {isRegister ? 'Inscription' : 'Connexion'}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nom (Affiché seulement si Inscription) */}
        {isRegister && (
          <div className="input-group" style={{position: 'relative'}}>
            <User style={{position: 'absolute', left: '10px', width: '20px', height: '20px', marginTop: '0.9rem'}}/>
            <input 
              type="text" 
              id="name"
              name="name"
              placeholder=" " 
              value={formData.name} 
              onChange={handleChange} 
              required
              style={{
              paddingLeft: '50px',
              boxSizing: 'border-box'
            }}
            />
            <label htmlFor="name" style={{marginLeft: '1.5rem'}} >Nom</label>
          </div>
        )}

        {/* Email */}
        <div className="input-group" style={{position: 'relative'}}>
          <Mail style={{position: 'absolute', left: '10px', width: '20px', height: '20px', marginTop:'0.9rem' }}/>
          <input 
            type="email"
            id="email"
            name="email"
            placeholder=" " 
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              paddingLeft: '50px',
              boxSizing: 'border-box'
            }}
          />
          <label htmlFor="email" style={{marginLeft: '1.5rem'}}>Email</label>
        </div>

        {/* Mot de passe */}
        <div className="input-group" style={{position: 'relative'}}>
          <Lock style={{position: 'absolute', left: '10px', width: '20px', height: '20px', marginTop:'0.9rem' }} />
          <input 
            type="password" 
            id="pswd"
            name="pswd"
            placeholder=" " 
            value={formData.pswd}
            onChange={handleChange}
            required
            style={{
              paddingLeft: '50px',
              boxSizing: 'border-box'
            }}
          />
          <label htmlFor="pswd" style={{marginLeft: '1.5rem'}}>Mot de passe</label>
        </div>
        
        <button type="submit" className="btn-primary">
          {isRegister ? 'Créer un utilisateur' : 'Démarrer une session'}
          <ArrowRight size={16} />
        </button>
      </form>

      <button 
        type="button" 
        className="btn-link"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister ? 'Déjà un compte ? Connexion' : 'Nouveau ? Créer un compte'}
      </button>
    </div>
  );
}