
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';

export default function ClassBox({ player }) {
  const {
    rank,
    name,
    email,
    title,
    wins,
    losses,
    totalMatches,
    avatar = DEFAULT_AVATAR,
    badgeColor,
    borderColor,
    order,
    scale,
    isFirst,
    winRate
  } = player;

  return (
    <div
      className={`${order} glass-card rounded-xl ${
        isFirst
          ? 'p-10 border-primary/30 active-glow bg-surface-container-high'
          : 'p-8'
      } flex flex-col items-center transform ${scale} transition-transform duration-300`}
    >
      <div className={`relative ${isFirst ? 'mb-6' : 'mb-4'}`}>
        <div
          className={`${
            isFirst ? 'w-32 h-32' : 'w-24 h-24'
          } rounded-full border-4 ${borderColor} overflow-hidden ${
            isFirst ? 'shadow-[0_0_20px_rgba(242,187,19,0.5)]' : ''
          }`}
        >
          <img
            className="w-full h-full object-cover"
            alt={name}
            src={avatar}
          />
        </div>
        <div
          className={`absolute ${
            isFirst ? '-bottom-3' : '-bottom-2'
          } left-1/2 -translate-x-1/2 ${badgeColor} ${
            isFirst ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs'
          } rounded-full font-bold shadow-lg`}
        >
          {rank === 1 ? '1er' : `${rank}e`}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-on-surface mb-1 text-center">
        {name}
      </h3>
      <p
        className={`${
          isFirst ? 'text-primary/70 italic' : 'text-secondary'
        } text-xs tracking-wider uppercase mb-4`}
      >
        {title}
      </p>

      <div className="w-full space-y-2">
        <div
          className={`w-full flex justify-between items-center text-sm border-t ${
            isFirst ? 'border-white/10' : 'border-white/5'
          } pt-4`}
        >
          <span
            className={`flex items-center gap-1 ${
              isFirst ? 'text-primary font-bold' : ''
            }`}
          >
            {wins} Victoires
          </span>
          <span className="text-xs text-on-surface-variant">
            {winRate}% de victoires
          </span>
        </div>
        <div className="w-full flex justify-between text-xs text-on-surface-variant">
          <span>Matchs: {totalMatches}</span>
          <span>Défaites: {losses}</span>
        </div>
      </div>
    </div>
  );
}