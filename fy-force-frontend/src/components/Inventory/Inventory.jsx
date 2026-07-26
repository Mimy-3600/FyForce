import '../../style/Path.css'
import DotField from '@/reactbits/DotField'
import { useState, useEffect } from 'react'
import { getCurrentUser, getToken } from '../../services/auth'
import SpecularButton from '../SpecularButton';
import { Pickaxe, Search } from 'lucide-react';
import TextType from '../TextType';

const TOTAL_SLOTS = 16;

function Path() {
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState([]);
  const [artefacts, setArtefacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Récupération de l'utilisateur et du token depuis le localStorage
      const user = getCurrentUser();
      const token = getToken();

      console.log(user);
      
      // Email par défaut si aucun utilisateur n'est connecté en local
      const userEmail = user?.email || "andry.paul@eni-fianar.mg";

      // Configuration des headers (avec le Token si présent)
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      try {
        const [resItems, resArtefacts] = await Promise.all([
          fetch(`http://localhost:3000/api/item/itemsUser/${userEmail}/`, { headers }),
          fetch(`http://localhost:3000/api/artefact/${userEmail}/artefacts`, { headers })
        ]);

        const dataItems = await resItems.json();
        const dataArtefacts = await resArtefacts.json();

        setItems(dataItems.data || []);
        setArtefacts(dataArtefacts.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItem(null);
  };

  const currentList = activeTab === 'items' ? items : artefacts;
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, index) => currentList[index] || null);

  return (
    <div className="path relative min-h-screen w-full flex flex-col items-center justify-center gap-6 p-6 mt-15 bg-slate-950">
      
      {/* Grille de fond décorative */}
      <div className="absolute inset-0 p-8 opacity-25 pointer-events-none grid grid-cols-4 md:grid-cols-8 gap-4">
        {Array.from({ length: 32 }).map((_, i) => (
          <div key={i} className="border border-dashed border-slate-700/60 rounded-xl aspect-square" />
        ))}
      </div>

      {/* Titre */}
      <div className="z-10 flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold tracking-wide">
           <span className="text-[#B497CF]">Inventaire : </span>
           <TextType
                text={["Le fruit de vos efforts", "Utiliser les items pour vous améliorer"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor
                cursorCharacter="_"
                texts={["Welcome to React Bits! Good to see you!","Build some amazing experiences!"]}
                deletingSpeed={50}
                variableSpeedEnabled={false}
                variableSpeedMin={60}
                variableSpeedMax={120}
                cursorBlinkDuration={0.5}
              />
        </h1>
      </div>

      {/* Conteneur principal (Grille + Preview) */}
      <div className="path-container relative w-full max-w-5xl rounded-2xl border border-slate-700/50 p-6 overflow-hidden shadow-2xl z-10 bg-slate-900/40 backdrop-blur-sm">
        
        {/* DotField à l'intérieur du conteneur */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <DotField
            dotRadius={1.5}
            dotSpacing={40}
            bulgeStrength={16}
            glowRadius={50}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={500}
            cursorForce={0.01}
            bulgeOnly
            gradientFrom="#e2ffda"
            gradientTo="#B497CF"
            glowColor="#120F17"
          />
        </div>

        {/* Commutateur d'onglets */}
        <div className="relative z-10 flex justify-between mb-6">
          <div className="inline-flex gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-700/60 backdrop-blur-md shadow-lg">
            <button
              onClick={() => handleTabChange('items')}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'items'
                  ? 'bg-[#B497CF] text-slate-950 font-bold shadow-md shadow-[#B497CF]/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Items ({items.length})
            </button>
            <button
              onClick={() => handleTabChange('artefacts')}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'artefacts'
                  ? 'bg-[#e2ffda] text-slate-950 font-bold shadow-md shadow-[#e2ffda]/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Artefacts ({artefacts.length})
            </button>
          </div>
          <SpecularButton
            size="lg"
            radius={18}
            tint="#ffffff"
            tintOpacity={0}
            blur={0}
            textColor="#f5f5f5"
            lineColor="#ffffff"
            baseColor="#525252"
            intensity={1}
            shineSize={10}
            shineFade={40}
            thickness={1}
            speed={0.35}
            followMouse
            proximity={250}
            autoAnimate={false}
            onClick={() => console.log('clicked')}
          >
            <div className='flex items-center gap-2'>
              Crafter
              <Pickaxe/> 
            </div>
          </SpecularButton>
        </div>

        {/* Section Grille + Preview */}
        {loading ? (
          <div className="relative z-10 text-center text-slate-400 py-12 animate-pulse font-mono">
            Chargement des éléments...
          </div>
        ) : (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Grille de 16 slots */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {slots.map((item, index) => {
                const isSelected = selectedItem && item && (
                  activeTab === 'items' 
                    ? selectedItem.ID_ITEM === item.ID_ITEM 
                    : selectedItem.ID_ARTEFACT === item.ID_ARTEFACT
                );

                return (
                  <div
                    key={index}
                    onClick={() => item && setSelectedItem(item)}
                    className={`
                      aspect-square rounded-xl border flex flex-col items-center justify-center p-2 text-center transition-all duration-300 select-none relative group
                      ${item 
                        ? isSelected
                          ? 'bg-slate-900 border-[#e2ffda] scale-105 ring-2 ring-[#e2ffda]/40 shadow-lg shadow-[#e2ffda]/20 cursor-pointer backdrop-blur-md'
                          : 'bg-slate-950/80 border-[#B497CF]/70 hover:border-[#e2ffda] hover:scale-105 shadow-md hover:shadow-[#e2ffda]/30 cursor-pointer backdrop-blur-md'
                        : 'bg-slate-950/30 border-slate-700/50 border-dashed backdrop-blur-xs'
                      }
                    `}
                  >
                    {item ? (
                      <>
                        <span className="text-xs font-semibold text-slate-100 truncate w-full">
                          {activeTab === 'items' ? item.NOM_ITEM : item.CODE_ARTEFACT}
                        </span>

                        {activeTab === 'artefacts' && item.STAT_ARTEFACT && (
                          <span className="mt-1 text-[10px] bg-[#e2ffda]/20 text-[#e2ffda] px-1.5 py-0.5 rounded-md font-mono">
                            +{item.STAT_ARTEFACT}
                          </span>
                        )}

                        <span className="absolute bottom-1 right-1 text-[9px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                          #{activeTab === 'items' ? item.ID_ITEM : item.ID_ARTEFACT}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-600 text-xs font-mono">
                        {index + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Case de Preview */}
            <div className="lg:col-span-1 bg-slate-950/80 border border-slate-700/80 rounded-xl p-5 flex flex-col items-center text-center backdrop-blur-md min-h-[300px] justify-between shadow-xl">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 w-full pb-2">
                Aperçu de l'élément
              </h2>

              {selectedItem ? (
                <div className="flex flex-col items-center justify-center my-auto w-full gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-[#B497CF] flex items-center justify-center text-2xl shadow-lg shadow-[#B497CF]/20">
                    {activeTab === 'items' ? '📦' : '🛡️'}
                  </div>

                  <h3 className="text-lg font-bold text-white mt-1">
                    {activeTab === 'items' ? selectedItem.NOM_ITEM : selectedItem.CODE_ARTEFACT}
                  </h3>

                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                    ID: #{activeTab === 'items' ? selectedItem.ID_ITEM : selectedItem.ID_ARTEFACT}
                  </span>

                  {activeTab === 'artefacts' && (
                    <div className="w-full mt-2 bg-slate-900/90 border border-slate-800 rounded-lg p-2 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Statistique :</span>
                      <span className="font-mono font-bold text-[#e2ffda]">+{selectedItem.STAT_ARTEFACT}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto text-slate-500 gap-2">
                  <div className="text-3xl opacity-40">
                    <Search/>
                  </div>
                  <p className="text-xs">Clique sur un emplacement de la grille pour afficher les détails.</p>
                </div>
              )}

              <div className="w-full pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                {selectedItem ? "Élément sélectionné" : "Aucune sélection"}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  )
}

export default Path