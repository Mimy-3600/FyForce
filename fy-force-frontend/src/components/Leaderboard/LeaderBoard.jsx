// LeaderboardDashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import TopThree from './TopThree';
import LeaderboardTable from './LeaderboardTable';

// Instance Axios configurée
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export default function LeaderboardDashboard({ currentUserEmail = "andry.paul@eni-fianar.mg" }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';


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

  // --- TRAITEMENT DES DONNÉES ---

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
      
      wins: player.VICTOIRES,
      losses: player.DEFAITES,
      totalMatches: player.TOTAL_MATCHES,
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
      winRate: player.TOTAL_MATCHES > 0 ? Math.round((player.VICTOIRES / player.TOTAL_MATCHES) * 100) : 0,
    };
  });

  // 2. Extraire l'utilisateur courant s'il existe dans la liste
  const currentUser = leaderboard.find(u => u.EMAIL_USER === currentUserEmail);

  // 3. Joueurs restants (Rang 4 et plus) pour le tableau
  const rankingRows = leaderboard.filter(row => row.RANG > 3);

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans overflow-x-hidden">
      <main className="max-w-6xl mx-auto px-5 md:px-10 py-12 pb-30">
        {/* Header Section */}
        <section>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Classement Mondial
          </h1>
        </section>

        {/* Podium Section */}
        <TopThree topPlayers={topPlayers} />

        {/* Leaderboard Table */}
        <LeaderboardTable 
          rankingRows={rankingRows}
          currentUser={currentUser}
          currentUserEmail={currentUserEmail}
        />

      </main>
    </div>
  );
}