import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Instance Axios configurée
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Configs visuelles pour le podium (Top 3)
const PODIUM_STYLES = [
  {
    order: 'order-1 md:order-2',
    borderColor: 'border-primary',
    badgeColor: 'bg-primary text-on-primary',
    scale: 'hover:scale-110',
    isFirst: true,
  },
  {
    order: 'order-2 md:order-1',
    borderColor: 'border-secondary',
    badgeColor: 'bg-secondary text-on-secondary',
    scale: 'hover:scale-105',
    isFirst: false,
  },
  {
    order: 'order-3',
    borderColor: 'border-[#CD7F32]',
    badgeColor: 'bg-[#CD7F32] text-white',
    scale: 'hover:scale-105',
    isFirst: false,
  },
];

export default function LeaderboardDashboard({ currentUserEmail }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await API.get('/match/leaderboard/victory');
        
        // Formate les données renvoyées par l'API
        const formattedData = response.data.data.map((player) => ({
          rank: player.RANG,
          email: player.EMAIL_USER,
          name: `${player.PRENOM_USER} ${player.NOM_USER}`,
          wins: player.VICTOIRES,
          losses: player.DEFAITES,
          totalMatches: player.TOTAL_MATCHES,
          // Avatar par défaut via Dicebear basé sur le nom/email
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(player.EMAIL_USER)}`,
        }));

        setLeaderboard(formattedData);
      } catch (err) {
        console.error("Erreur lors de la récupération du classement:", err);
        setError("Impossible de charger le classement.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Découpage : Top 3 pour le podium, et le reste pour le tableau
  const rawTop3 = leaderboard.slice(0, 3);
  
  // Réorganisation pour le podium CSS (2ème à gauche, 1er au centre, 3ème à droite)
  const top3Podium = [
    rawTop3[1] ? { ...rawTop3[1], ...PODIUM_STYLES[1] } : null,
    rawTop3[0] ? { ...rawTop3[0], ...PODIUM_STYLES[0] } : null,
    rawTop3[2] ? { ...rawTop3[2], ...PODIUM_STYLES[2] } : null,
  ].filter(Boolean);

  const rankingRows = leaderboard.slice(3);

  // Recherche de l'utilisateur connecté s'il est fourni en prop
  const currentUser = currentUserEmail 
    ? leaderboard.find((player) => player.email === currentUserEmail) 
    : null;

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

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans overflow-x-hidden">
      <main className="max-w-6xl mx-auto px-5 md:px-10 py-12 pb-32">
        <section className="mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Classement Mondial
          </h1>
        </section>

        {/* Section Podium (Top 3 Players) */}
        {top3Podium.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end">
            {top3Podium.map((player) => (
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

                <h3 className="text-xl font-semibold text-on-surface mb-1">
                  {player.name}
                </h3>

                <div
                  className={`w-full flex justify-between items-center text-sm border-t ${
                    player.isFirst ? 'border-white/10' : 'border-white/5'
                  } pt-4 mt-2`}
                >
                  <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                    {player.totalMatches} Matchs
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      player.isFirst ? 'text-primary font-bold' : ''
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">swords</span>
                    {player.wins} Victoires
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

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
                    VICTOIRES
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Ligne personnalisée si l'utilisateur connecté est trouvé */}
                {currentUser && (
                  <tr className="bg-primary/5 border-l-4 border-primary hover:bg-white/10 transition-colors cursor-pointer">
                    <td className="px-6 py-5">
                      <span className="font-bold text-primary">{currentUser.rank}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-primary/30 overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            alt={currentUser.name}
                            src={currentUser.avatar}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{currentUser.name} (Vous)</p>
                          <p className="text-xs text-primary/70">{currentUser.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-on-surface">
                      {currentUser.losses}
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-primary font-bold">
                      {currentUser.wins}
                    </td>
                  </tr>
                )}

                {/* Autres joueurs du classement */}
                {rankingRows.map((row) => (
                  <tr
                    key={row.email}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-on-surface-variant">{row.rank}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            alt={row.name}
                            src={row.avatar}
                          />
                        </div>
                        <span className="font-medium">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-on-surface-variant">
                      {row.losses}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-on-surface">
                      {row.wins}
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