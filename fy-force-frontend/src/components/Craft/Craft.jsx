import { useState } from 'react';
import { Sparkles, ArrowRight, Check, Zap, Loader2 } from 'lucide-react';
import ElectricBorder from '../ElectricBorder';

export default function Craft({ onCraft }) {
  const [isCrafting, setIsCrafting] = useState(false);
  const [crafted, setCrafted] = useState(false);
  const [hoveredArtifact, setHoveredArtifact] = useState(null);

  // Exemple de données d'artefacts
  const artifacts = [
    { id: 1, name: "SwordJS_12", icon: "🔮", rarity: "from-blue-500 to-indigo-600" },
    { id: 2, name: "JsShield", icon: "🔥", rarity: "from-red-500 to-orange-600" },
    { id: 3, name: "JsCraft_25", icon: "🌙", rarity: "from-purple-600 to-pink-600" },
  ];

  // Item final
  const finalItem = {
    name: "JS Master",
    icon: "⚡",
    stats: "Master JS Fundamentals"
  };

  const handleCraft = () => {
    setIsCrafting(true);
    setCrafted(false);
    setTimeout(() => {
      setIsCrafting(false);
      setCrafted(true);
      if (onCraft) onCraft();
    }, 1200);
  };

  return (
    <div className='flex items-center justify-center'>
      <ElectricBorder
        color="#b497cf"
        speed={1}
        chaos={0.12}
        thickness={2}
        style={{ borderRadius: 16 }}
        className="w-fit"
      >
        <div className="w-full max-w-4xl mx-auto p-6 rounded-3xl border border-slate-800 shadow-2xl text-white bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm">
          {/* En-tête avec animation */}
          <div className="text-center mb-6 animate-fade-in-down">
            <h3 className="text-2xl font-bold tracking-wide bg-clip-text text-secondary animate-gradient">
              Forge d'Artefacts
            </h3>
            <p className="text-sm text-slate-400 mt-1 animate-pulse-slow">
              Combine 3 artefacts anciens pour forger un équipement mythique
            </p>
          </div>

          {/* Zone de Fusion */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
            
            {/* COLONNE GAUCHE : 3 Artefacts empilés */}
            <div className="flex flex-col gap-3 h-full justify-between">
              {artifacts.map((art, index) => (
                <div
                  key={art.id}
                  className={`flex-1 flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 relative overflow-hidden
                    ${isCrafting ? 'animate-pulse border-amber-500/50' : 'border-slate-700/60'}
                    ${hoveredArtifact === art.id ? 'scale-105 border-secondary/70 shadow-lg shadow-secondary/20' : 'hover:border-slate-500'}
                    bg-slate-800/80 backdrop-blur
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                  onMouseEnter={() => setHoveredArtifact(art.id)}
                  onMouseLeave={() => setHoveredArtifact(null)}
                >
                  {/* Effet de brillance au survol */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-secondary/10 to-transparent transition-transform duration-700 
                    ${hoveredArtifact === art.id ? 'translate-x-full' : '-translate-x-full'}`} 
                  />
                  
                  <div className="relative z-10 flex items-center justify-center gap-3 w-full">
                    <div className="flex gap-2 items-center justify-center min-w-0">
                      <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">Artefact</span>
                      <h4 className="text-sm font-bold text-slate-200 truncate">{art.name}</h4>
                    </div>
                    {crafted && (
                      <div className="text-emerald-400 animate-bounce-in">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* COLONNE CENTRE : Connecteur & Action de Fusion */}
            <div className="flex md:flex-col items-center justify-center py-4 md:py-0 px-2 gap-2 relative">
              {/* Lignes de connexion animées */}
              <div className={`hidden md:block w-1 flex-1 rounded-full transition-all duration-1000
                ${crafted ? 'bg-gradient-to-b from-emerald-500/60 via-emerald-400/40 to-transparent' : 'bg-gradient-to-b from-transparent via-secondary/40 to-transparent'}
                ${isCrafting ? 'animate-pulse' : ''}
              `} />
              
              <button
                onClick={handleCraft}
                disabled={isCrafting || crafted}
                className={`relative group p-4 rounded-full border transition-all duration-500 shadow-lg
                  ${crafted ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-emerald-500/20' : 'border-secondary/50 bg-secondary/10 text-secondary hover:bg-secondary hover:text-slate-950 shadow-secondary/10'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:scale-110 active:scale-95
                `}
              >
                {isCrafting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : crafted ? (
                  <Check className="w-6 h-6 text-emerald-400 animate-bounce-in" />
                ) : (
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                )}
                
                {/* Effet de ripple au clic */}
                <span className="absolute inset-0 rounded-full bg-secondary/20 animate-ping opacity-0 group-active:opacity-100" />
              </button>

              <div className={`hidden md:block w-1 flex-1 rounded-full transition-all duration-1000
                ${crafted ? 'bg-gradient-to-t from-emerald-500/60 via-emerald-400/40 to-transparent' : 'bg-gradient-to-t from-transparent via-secondary/40 to-transparent'}
                ${isCrafting ? 'animate-pulse' : ''}
              `} />
            </div>

            {/* COLONNE DROITE : Item Créé */}
            <div className={`flex flex-col justify-between p-5 rounded-2xl border transition-all duration-700 relative overflow-hidden
              ${crafted 
                ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-secondary/80 shadow-2xl shadow-secondary/20 animate-scale-in' 
                : 'bg-slate-800/40 border-slate-700/50 border-dashed'
              }
              ${isCrafting ? 'animate-pulse-slow' : ''}
            `}>
              {/* Halo lumineux en fond d'item */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-all duration-1000
                ${crafted ? 'bg-secondary/20 animate-pulse' : 'bg-secondary/5'}
              `} />

              {/* Particules flottantes (effet visuel) */}
              {crafted && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-secondary rounded-full animate-float-particle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${3 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* En-tête de l'Item */}
              <div className="flex justify-center items-center">
                <span className="text-xs text-slate-400">Résultat</span>
              </div>

              {/* Visuel central de l'Item */}
              <div className="my-6 flex flex-col items-center text-center">
                <div className={`relative w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mb-3 border transition-all duration-700
                  ${crafted
                    ? 'bg-secondary shadow-xl shadow-secondary/30 scale-105 animate-float border-secondary/50'
                    : 'bg-slate-800 border-slate-700 opacity-60'
                  }
                `}>
                  {crafted ? (
                    <>
                      {finalItem.icon}
                      {/* Effet de glow */}
                      <span className="absolute inset-0 rounded-2xl bg-secondary/20 blur-xl animate-pulse" />
                    </>
                  ) : (
                    <div className="animate-pulse-slow">⚡</div>
                  )}
                </div>
                
                <h3 className={`text-lg font-bold transition-all duration-500 ${crafted ? 'text-secondary/80' : 'text-slate-400'}`}>
                  {crafted ? finalItem.name : '???'}
                </h3>
                <p className={`text-xs font-mono transition-all duration-500 ${crafted ? 'text-secondary' : 'text-slate-500'}`}>
                  {crafted ? finalItem.stats : "Combinez pour débloquer"}
                </p>
              </div>

              {/* Pied de carte / Bouton d'action principal */}
              <button
                onClick={handleCraft}
                disabled={isCrafting || crafted}
                className={`relative w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden
                  ${crafted 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                    : 'bg-secondary text-slate-950 hover:brightness-110 active:scale-95'
                  }
                  shadow-md shadow-secondary/20 disabled:opacity-40 disabled:hover:brightness-100 disabled:active:scale-100
                `}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isCrafting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Assemblage en cours...
                    </>
                  ) : crafted ? (
                    <>
                      <Check className="w-4 h-4" />
                      Objet Crafté !
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Fusionner les artefacts
                    </>
                  )}
                </span>
                {!crafted && !isCrafting && (
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-yellow-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </ElectricBorder>

      {/* Styles CSS pour les animations personnalisées */}
      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes float-particle {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-30px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-particle {
          animation: float-particle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}