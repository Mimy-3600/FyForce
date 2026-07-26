import { useState, useEffect } from "react";
import { ArrowRight, Mail, Lock, User, Camera, Loader2 } from "lucide-react";
import axios from "axios";
import { saveSession, getCurrentUser } from "../services/auth";
import './Login.css';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', pswd: '', photoFile: null, photoPreview: null
  });

  // RESTAURER LA SESSION AUTOMATIQUEMENT
  useEffect(() => {
    const savedUser = getCurrentUser(); // Récupère l'utilisateur proprement
    if (savedUser && onLoginSuccess) {
      onLoginSuccess(savedUser);
    }
  }, [onLoginSuccess]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photoFile: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      if (isRegister) {
        const data = new FormData();
        data.append('NOM_USER', formData.nom);
        data.append('PRENOM_USER', formData.prenom);
        data.append('EMAIL_USER', formData.email);
        data.append('PASSWORD_USER', formData.pswd);
        if (formData.photoFile) data.append('PHOTO_USER', formData.photoFile);

        response = await API.post('/user/register', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const newUser = response.data.data;
        const token = response.data.token;

        saveSession(token, newUser); // 👈 Sauvegarde centralisée

        if (onLoginSuccess && newUser) onLoginSuccess(newUser);

      } else {
        response = await API.post('/user/login', {
          EMAIL_USER: formData.email,
          PASSWORD_USER: formData.pswd
        });

        const userData = response.data.user;
        const userToken = response.data.token;

        saveSession(userToken, userData); // 👈 Sauvegarde centralisée

        if (onLoginSuccess && userData) onLoginSuccess(userData);
      }

    } catch (err) {
      console.error("Erreur API :", err);
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="auth-header">
        <h2 className="auth-title">{isRegister ? 'Inscription' : 'Connexion'}</h2>
      </div>

      {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="avatar-upload-group">
            <label htmlFor="avatar-input" className="avatar-label">
              {formData.photoPreview ? (
                <img src={formData.photoPreview} alt="Aperçu" className="avatar-preview" />
              ) : (
                <div className="avatar-placeholder"><Camera size={24} /><span>Photo</span></div>
              )}
            </label>
            <input type="file" id="avatar-input" name="PHOTO_USER" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>
        )}

        {isRegister && (
          <>
            <div className="input-group" style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '10px', width: '20px', height: '20px', marginTop: '0.9rem' }} />
              <input type="text" id="nom" name="nom" placeholder=" " value={formData.nom} onChange={handleChange} required style={{ paddingLeft: '50px' }} />
              <label htmlFor="nom" style={{ marginLeft: '1.5rem' }}>Nom</label>
            </div>
            <div className="input-group" style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '10px', width: '20px', height: '20px', marginTop: '0.9rem' }} />
              <input type="text" id="prenom" name="prenom" placeholder=" " value={formData.prenom} onChange={handleChange} required style={{ paddingLeft: '50px' }} />
              <label htmlFor="prenom" style={{ marginLeft: '1.5rem' }}>Prénom</label>
            </div>
          </>
        )}

        <div className="input-group" style={{ position: 'relative' }}>
          <Mail style={{ position: 'absolute', left: '10px', width: '20px', height: '20px', marginTop: '0.9rem' }} />
          <input type="email" id="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} required style={{ paddingLeft: '50px' }} />
          <label htmlFor="email" style={{ marginLeft: '1.5rem' }}>Email</label>
        </div>

        <div className="input-group" style={{ position: 'relative' }}>
          <Lock style={{ position: 'absolute', left: '10px', width: '20px', height: '20px', marginTop: '0.9rem' }} />
          <input type="password" id="pswd" name="pswd" placeholder=" " value={formData.pswd} onChange={handleChange} required style={{ paddingLeft: '50px' }} />
          <label htmlFor="pswd" style={{ marginLeft: '1.5rem' }}>Mot de passe</label>
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : <>{isRegister ? 'Créer un utilisateur' : 'Démarrer une session'}<ArrowRight size={16} /></>}
        </button>
      </form>

      <button type="button" className="btn-link" onClick={() => { setIsRegister(!isRegister); setError(null); }} disabled={loading}>
        {isRegister ? 'Déjà un compte ? Connexion' : 'Nouveau ? Créer un compte'}
      </button>
    </div>
  );
}