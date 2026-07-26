import React, { useState } from "react";
import { ArrowRight, Mail, Lock, User, Camera } from "lucide-react";
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pswd: '',
    avatar: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file= e.target.files[0];
    if (file) {
      const reader =  new FileReader();
      reader.onloadend = ()=> {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onLoginSuccess) {
      onLoginSuccess({
        name: formData.name || 'Utilisateur',
        email: formData.email,
        avatar: formData.avatar
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

        {/* Upload de photo en inscription */}
        {isRegister && (
          <div className="avatar-upload-group">
            <label htmlFor="avatar-input" className="avatar-label">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Aperçu photo" className="avatar-preview" />
              ) : (
                <div className="avatar-placeholder">
                  <Camera size={24} />
                  <span>Photo</span>
                </div>
              )}
            </label>
            <input 
              type="file" 
              id="avatar-input" 
              name="avatar" 
              accept="image/*" 
              onChange={handleFileChange}
              style={{ display: 'none' }} // On cache le champ système moche
            />
          </div>
        )}


        {/* nom */}
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
        
        <button type="submit" className="btn">
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