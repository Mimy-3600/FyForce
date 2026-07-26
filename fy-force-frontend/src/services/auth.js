// Keys utilisées dans le localStorage
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/**
 * Enregistre les données de session après la connexion ou l'inscription
 */
export const saveSession = (token, user) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Récupère l'utilisateur connecté actuellement
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (err) {
    console.error("Erreur de lecture du localStorage :", err);
    clearSession();
    return null;
  }
};

/**
 * Récupère le Token JWT pour les requêtes HTTP sécurisées
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Déconnecte l'utilisateur en supprimant la session
 */
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Fonction universelle de Logout avec redirection ou callback optionnel
 * @param {Function} [onLogoutCallback] - Fonction React à exécuter (ex: setUser(null))
 */
export const logout = (onLogoutCallback) => {
  clearSession();
  
  if (typeof onLogoutCallback === 'function') {
    onLogoutCallback();
  }

  // Redirige vers l'accueil / login (à adapter selon votre routeur)
  window.location.href = '/';
};