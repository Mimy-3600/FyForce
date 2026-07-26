import { useState } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import ElectricBorder from '../ElectricBorder';

export default function Craft({ onCraft }) {
  const [isCrafting, setIsCrafting] = useState(false);
  const [crafted, setCrafted] = useState(false);

  // Exemple de données d'artefacts
  const artifacts = [
    { id: 1, name: "Orbe Tempétueuse", icon: "🔮", rarity: "from-blue-500 to-indigo-600" },
    { id: 2, name: "Cœur de Pyromancien", icon: "🔥", rarity: "from-red-500 to-orange-600" },
    { id: 3, name: "Fragment d'Ombre", icon: "🌙", rarity: "from-purple-600 to-pink-600" },
  ];

  // Item final
  const finalItem = {
    name: "Lame de l'Aurore Céleste",
    icon: "⚔️",
    type: "Arme Mythique",
    stats: "+150 Dégâts | +25% Critique"
  };

  const handleCraft = () => {
    setIsCrafting(true);
    setTimeout(() => {
      setIsCrafting(false);
      setCrafted(true);
      if (onCraft) onCraft();
    }, 1200);
  };

  return (
    <div className='flex items-center justify-center'>
        <ElectricBorder
            color="#7df9ff"
            speed={1}
            chaos={0.12}
            thickness={2}
            style={{ borderRadius: 16 }}
            className="w-fit"
            >

        <div className="w-full max-w-4xl mx-auto p-6  rounded-3xl border border-slate-800 shadow-2xl text-white">
        {/* En-tête */}
        <div className="text-center mb-6">
            <h3 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-200">
            Forje d'Artefacts
            </h3>
            <p className="text-sm text-slate-400 mt-1">Combine 3 artefacts anciens pour forger un équipement mythique</p>
        </div>

        {/* Zone de Fusion (Grille d'alignement parfait) */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
            
            {/* COLONNE GAUCHE : 3 Artefacts empilés */}
            <div className="flex flex-col gap-3 h-full justify-between">
            {artifacts.map((art) => (
                <div
                key={art.id}
                className={`flex-1 flex items-center gap-3 p-3 rounded-xl border border-slate-700/60 bg-slate-800/80 backdrop-blur transition-all duration-300 ${
                    isCrafting ? 'animate-pulse border-amber-500/50' : 'hover:border-slate-500'
                }`}
                >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${art.rarity} flex items-center justify-center text-2xl shadow-inner shrink-0`}>
                    {art.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">Artefact</span>
                    <h4 className="text-sm font-bold text-slate-200 truncate">{art.name}</h4>
                </div>
                </div>
            ))}
            </div>

            {/* COLONNE CENTRE : Connecteur & Action de Fusion */}
            <div className="flex md:flex-col items-center justify-center py-4 md:py-0 px-2 gap-2">
            {/* Ligne ou flèche de connexion */}
            <div className="hidden md:block w-1 flex-1 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent rounded-full" />
            
            <button
                onClick={handleCraft}
                disabled={isCrafting || crafted}
                className={`relative group p-4 rounded-full border border-amber-500/50 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 shadow-lg shadow-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed ${
                isCrafting ? 'animate-spin' : ''
                }`}
            >
                {crafted ? (
                <Check className="w-6 h-6 text-emerald-400" />
                ) : (
                <Sparkles className="w-6 h-6" />
                )}
            </button>

            <ArrowRight className="w-5 h-5 text-amber-400/70 hidden md:block" />
            <div className="hidden md:block w-1 flex-1 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent rounded-full" />
            </div>

            {/* COLONNE DROITE : Item Créé (Même hauteur exacte que la colonne de gauche) */}
            <div className={`flex flex-col justify-between p-5 rounded-2xl border transition-all duration-500 relative overflow-hidden ${
            crafted 
                ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/80 shadow-2xl shadow-amber-500/20' 
                : 'bg-slate-800/40 border-slate-700/50 border-dashed'
            }`}>
            {/* Halo lumineux en fond d'item */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* En-tête de l'Item */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {finalItem.type}
                </span>
                <span className="text-xs text-slate-400">Résultat</span>
            </div>

            {/* Visuel central de l'Item */}
            <div className="my-6 flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mb-3 border transition-all duration-500 ${
                crafted
                    ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 border-amber-300 shadow-xl shadow-amber-500/30 scale-105'
                    : 'bg-slate-800 border-slate-700 opacity-60'
                }`}>
                {finalItem.icon}
                </div>
                <h3 className={`text-lg font-bold ${crafted ? 'text-amber-200' : 'text-slate-400'}`}>
                {finalItem.name}
                </h3>
                <p className="text-xs text-amber-400/80 mt-1 font-mono">
                {crafted ? finalItem.stats : "Combinez pour débloquer"}
                </p>
            </div>

            {/* Pied de carte / Bouton d'action principal */}
            <button
                onClick={handleCraft}
                disabled={isCrafting || crafted}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:hover:brightness-100 disabled:active:scale-100"
            >
                {isCrafting ? "Assemblage en cours..." : crafted ? "Objet Crafté !" : "Fusionner les artefacts"}
            </button>
            </div>

        </div>
        </div>

        </ElectricBorder>
    </div>
  );
}