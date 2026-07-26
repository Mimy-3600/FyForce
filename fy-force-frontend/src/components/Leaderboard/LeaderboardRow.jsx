

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';

export default function LeaderboardRow({ player, isCurrentUser = false }) {
  const winRate = player.TOTAL_MATCHES > 0 
    ? Math.round((player.VICTOIRES / player.TOTAL_MATCHES) * 100) 
    : 0;

  if (isCurrentUser) {
    return (
      <tr className="bg-primary/10 border-l-4 border-primary hover:bg-white/10 transition-colors cursor-pointer">
        <td className="px-6 py-5">
          <span className="font-bold text-primary">{player.RANG}</span>
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
              {player.NOM_USER} {player.PRENOM_USER}  (Vous)
              </p>
              <p className="text-xs text-primary/70">Joueur Actif</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-5 text-right font-mono text-on-surface-variant">
          {player.TOTAL_MATCHES}
        </td>
        <td className="px-6 py-5 text-right font-mono text-primary font-bold">
          {player.VICTOIRES}
        </td>
        <td className="px-6 py-5 text-right font-mono text-on-surface-variant">
          {player.DEFAITES}
        </td>
        <td className="px-6 py-5 text-right font-mono text-on-surface font-semibold">
          {winRate}%
        </td>
      </tr>
    );
  }

  return (
    <tr
      className="hover:bg-white/5 transition-colors cursor-pointer"
    >
      <td className="px-6 py-4 text-on-surface-variant">{player.RANG}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt={`${player.PRENOM_USER} ${player.NOM_USER}`}
              src={DEFAULT_AVATAR}
            />
          </div>
          <span className="font-medium">
            {player.NOM_USER} {player.PRENOM_USER} 
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right font-mono text-on-surface-variant">
        {player.TOTAL_MATCHES}
      </td>
      <td className="px-6 py-4 text-right font-mono text-primary font-bold">
        {player.VICTOIRES}
      </td>
      <td className="px-6 py-4 text-right font-mono text-on-surface-variant">
        {player.DEFAITES}
      </td>
      <td className="px-6 py-4 text-right font-mono text-on-surface font-semibold">
        {winRate}%
      </td>
    </tr>
  );
}