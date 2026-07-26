import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Instance Axios configurée
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Avatar par défaut au cas où l'utilisateur n'en a pas
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';

export default function LeaderboardDashboard({ currentUserEmail = "votre_email@exemple.com" }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await API.get('/match/leaderboard/victory');
        setLeaderboard(response.data.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération du classement:", err);
        setError("Impossible de charger le classement.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-primary font-bold">
        Chargement du classement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );
  }

  // --- TRAITEMENT DES DONNÉES DE L'API ---

  // 1. Extraire les 3 premiers pour le podium
  const rawTop3 = leaderboard.slice(0, 3);
  
  // Mappage pour appliquer les classes visuelles du podium
  const topPlayers = rawTop3.map((player) => {
    const isFirst = player.RANG === 1;
    const isSecond = player.RANG === 2;
    
    return {
      rank: player.RANG,
      name: `${player.PRENOM_USER} ${player.NOM_USER}`,
      email: player.EMAIL_USER,
      title: isFirst ? 'ARCHIVISTE SUPRÊME' : isSecond ? 'MAGE DE DONNÉES' : 'ARTIFEX',
      wins: player.VICTOIRES,
      avatar: DEFAULT_AVATAR,
      badgeColor: isFirst 
        ? 'bg-primary text-on-primary' 
        : isSecond 
        ? 'bg-secondary text-on-secondary' 
        : 'bg-[#CD7F32] text-white',
      borderColor: isFirst 
        ? 'border-primary' 
        : isSecond 
        ? 'border-secondary' 
        : 'border-[#CD7F32]',
      order: isFirst ? 'order-1 md:order-2' : isSecond ? 'order-2 md:order-1' : 'order-3',
      scale: isFirst ? 'hover:scale-110' : 'hover:scale-105',
      isFirst,
    };
  });

  // 2. Extraire l'utilisateur courant s'il existe dans la liste
  const currentUser = leaderboard.find(u => u.EMAIL_USER === currentUserEmail);

  // 3. Joueurs restants (Rang 4 et plus) pour le tableau
  const rankingRows = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans overflow-x-hidden">
      <main className="max-w-6xl mx-auto px-5 md:px-10 py-12 pb-32">
        {/* Header Section */}
        <section className="mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Classement Mondial
          </h1>
        </section>

        {/* Podium Section (Top 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end">
          {topPlayers.map((player) => (
            <div
              key={player.email}
              className={`${player.order} glass-card rounded-xl ${
                player.isFirst
                  ? 'p-10 border-primary/30 active-glow bg-surface-container-high'
                  : 'p-8'
              } flex flex-col items-center transform ${player.scale} transition-transform duration-300`}
            >
              <div className={`relative ${player.isFirst ? 'mb-6' : 'mb-4'}`}>
                <div
                  className={`${
                    player.isFirst ? 'w-32 h-32' : 'w-24 h-24'
                  } rounded-full border-4 ${player.borderColor} overflow-hidden ${
                    player.isFirst ? 'shadow-[0_0_20px_rgba(242,187,19,0.5)]' : ''
                  }`}
                >
                  <img
                    className="w-full h-full object-cover"
                    alt={player.name}
                    src={player.avatar}
                  />
                </div>
                <div
                  className={`absolute ${
                    player.isFirst ? '-bottom-3' : '-bottom-2'
                  } left-1/2 -translate-x-1/2 ${player.badgeColor} ${
                    player.isFirst ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs'
                  } rounded-full font-bold shadow-lg`}
                >
                  {player.rank === 1 ? '1er' : `${player.rank}e`}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-on-surface mb-1 text-center">
                {player.name}
              </h3>
              <p
                className={`${
                  player.isFirst ? 'text-primary/70 italic' : 'text-secondary'
                } text-xs tracking-wider uppercase mb-4`}
              >
                {player.title}
              </p>

              <div
                className={`w-full flex justify-between items-center text-sm border-t ${
                  player.isFirst ? 'border-white/10' : 'border-white/5'
                } pt-4`}
              >
                <span
                  className={`flex items-center gap-1 ${
                    player.isFirst ? 'text-primary font-bold' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">swords</span>
                  {player.wins} Victoires
                </span>
                <span className="text-xs text-on-surface-variant">
                  {player.wins}V / {player.wins}M
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="glass-card rounded-xl overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-white/5">
                  <th className="px-6 py-4 text-xs tracking-wider font-bold text-on-surface-variant uppercase">
                    RANG
                  </th>
                  <th className="px-6 py-4 text-xs tracking-wider font-bold text-on-surface-variant uppercase">
                    JOUEUR
                  </th>
                  <th className="px-6 py-4 text-xs tracking-wider font-bold text-on-surface-variant uppercase text-right">
                    DÉFAITES
                  </th>
                  <th className="px-6 py-4 text-xs tracking-wider font-bold text-on-surface-variant uppercase text-right">
                    VICTOIRES PVP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Ligne mise en avant pour l'utilisateur actuel */}
                {currentUser && (
                  <tr className="bg-primary/10 border-l-4 border-primary hover:bg-white/10 transition-colors cursor-pointer">
                    <td className="px-6 py-5">
                      <span className="font-bold text-primary">{currentUser.RANG}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-primary/30 overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            alt="User profile"
                            src={DEFAULT_AVATAR}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">
                            {currentUser.PRENOM_USER} {currentUser.NOM_USER} (Vous)
                          </p>
                          <p className="text-xs text-primary/70">Joueur Actif</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-on-surface-variant">
                      {currentUser.DEFAITES}
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-primary font-bold">
                      {currentUser.VICTOIRES}
                    </td>
                  </tr>
                )}

                {/* Tableau principal des joueurs (Rang 4+) */}
                {rankingRows.map((row) => (
                  <tr
                    key={row.EMAIL_USER}
                    className={`hover:bg-white/5 transition-colors cursor-pointer ${
                      row.EMAIL_USER === currentUserEmail ? 'bg-white/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-on-surface-variant">{row.RANG}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            alt={`${row.PRENOM_USER} ${row.NOM_USER}`}
                            src={DEFAULT_AVATAR}
                          />
                        </div>
                        <span className="font-medium">
                          {row.PRENOM_USER} {row.NOM_USER}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-on-surface-variant">
                      {row.DEFAITES}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-on-surface font-semibold">
                      {row.VICTOIRES}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}