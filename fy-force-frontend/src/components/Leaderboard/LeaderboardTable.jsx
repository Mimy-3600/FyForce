import LeaderboardRow from './LeaderboardRow';

export default function LeaderboardTable({ rankingRows, currentUser, currentUserEmail }) {
  return (
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
                MATCHS
              </th>
              <th className="px-6 py-4 text-xs tracking-wider font-bold text-on-surface-variant uppercase text-right">
                VICTOIRES
              </th>
              <th className="px-6 py-4 text-xs tracking-wider font-bold text-on-surface-variant uppercase text-right">
                DÉFAITES
              </th>
              <th className="px-6 py-4 text-xs tracking-wider font-bold text-on-surface-variant uppercase text-right">
                WIN RATE
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {/* Ligne mise en avant pour l'utilisateur actuel */}
            {currentUser && (
              <LeaderboardRow player={currentUser} isCurrentUser={true} />
            )}

            {/* Tableau principal des joueurs (Rang 4+) */}
            {rankingRows.map((row) => (
              <LeaderboardRow 
                key={row.EMAIL_USER} 
                player={row} 
                isCurrentUser={row.EMAIL_USER === currentUserEmail}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}