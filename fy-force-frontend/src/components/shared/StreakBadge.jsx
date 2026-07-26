export function StreakBadge({ count = 3 }) {
    return (
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-orange-500/30 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm hover:scale-105 transition-transform cursor-pointer">
        {/* Icône de flamme SVG */}
        <span className="relative flex items-center justify-center">
          <svg 
            className="w-5 h-5 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 23c-4.97 0-9-3.58-9-8 0-4.19 3.01-7.12 6.01-10.03.86-.84 1.73-1.69 2.49-2.61.18-.22.46-.36.75-.36s.57.14.75.36c.76.92 1.63 1.77 2.49 2.61C18.49 7.88 21 10.81 21 15c0 4.42-4.03 8-9 8zm0-18.15C10.02 6.84 8 9.06 8 13.5c0 2.48 1.79 4.5 4 4.5s4-2.02 4-4.5c0-4.44-2.02-6.66-4-8.65z"/>
          </svg>
        </span>
  
        {/* Compteur & Texte */}
        <span className="font-extrabold text-sm text-orange-600 tracking-tight">
          {count} <span className="text-xs font-semibold text-orange-500">Jours</span>
        </span>
      </div>
    );
  }