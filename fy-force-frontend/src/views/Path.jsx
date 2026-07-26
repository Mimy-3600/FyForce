import '../style/Path.css'
import DotField from '../reactbits/DotField.jsx'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TextType from '@/components/TextType'
import { getCurrentUser } from '../services/auth'

export default function Path() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [nextModules, setNextModules] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    const userEmail = currentUser?.EMAIL_USER || currentUser?.email;

    if (!userEmail) {
      console.warn("Aucun email utilisateur trouvé en session.");
      setLoading(false);
      return;
    }

    setUser(currentUser);

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [resLessons, resProgress] = await Promise.all([
          fetch(`http://localhost:3000/api/lesson/user/${userEmail}`),
          fetch(`http://localhost:3000/api/lesson/progress/${userEmail}`)
        ]);

        const dataLessons = await resLessons.json();
        const dataProgress = await resProgress.json();

        if (resLessons.ok && Array.isArray(dataLessons.data)) {
          setLessons(dataLessons.data);

          const modulesMap = {};
          await Promise.all(
            dataLessons.data.map(async (lec) => {
              try {
                const resMod = await fetch(`http://localhost:3000/api/lesson/${lec.ID_LECON}/next-module`);
                const dataMod = await resMod.json();
                if (resMod.ok && dataMod.data) {
                  modulesMap[lec.ID_LECON] = dataMod.data;
                }
              } catch (e) {
                console.error(`Erreur module leçon ${lec.ID_LECON}:`, e);
              }
            })
          );
          setNextModules(modulesMap);
        }

        if (resProgress.ok) {
          setProgress(dataProgress.data);
        }

      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-700 font-medium relative z-10">Chargement de votre carte d'apprentissage...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-800 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4 text-lg font-medium">Veuillez vous connecter pour accéder à votre parcours.</p>
        <button 
          onClick={() => navigate('/login')} 
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all shadow-md cursor-pointer"
        >
          Se connecter
        </button>
      </div>
    );
  }

  const displayName = `${user.PRENOM_USER || ''} ${user.NOM_USER || ''}`.trim() || user.EMAIL_USER;

  return (
    <div className="path flex items-center justify-center min-h-screen relative bg-slate-50">
      <div className="path-container w-full max-w-6xl mx-auto p-4 pt-10 z-10 relative">
        
        {/* Entête Éclaircie */}
        <div className="path-header mb-8 text-center">
          <div className="text-white font-bold text-2xl">
            <TextType 
              text={[`Bienvenue ${displayName}`, "Carte de progression", "Sélectionnez un nœud pour continuer"]}
              typingSpeed={65}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
            />
          </div>
          
          {progress && (
            <div className="flex justify-center items-center gap-6 mt-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-gray-200 shadow-sm w-fit mx-auto text-xs">
              <span className="text-white font-medium">Leçons : <strong className="text-white">{progress.LECONS_TERMINEES}/{progress.TOTAL_LECONS}</strong></span>
              <span className="text-amber-600 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {progress.POURCENTAGE} Complété
              </span>
            </div>
          )}
        </div>

        {/* CARTE CODINGAME (Style Clair comme le vrai site) */}
        <div className="codingame-map-wrapper relative overflow-x-auto p-8 rounded-2xl bg-white/1 shadow-xl backdrop-blur-md custom-scrollbar">
          
          <div className="codingame-nodes-grid flex flex-wrap justify-center items-center gap-x-12 gap-y-16 min-w-[700px] py-6">
            
            {lessons.map((lec, index) => {
              const isFinished = lec.TERMINE === 1;
              const moduleActif = nextModules[lec.ID_LECON];
              const isLast = index === lessons.length - 1;

              const nodeStyle = isFinished 
                ? 'node-orange' 
                : moduleActif 
                ? 'node-red' 
                : 'node-gray';

              return (
                <div key={lec.ID_LECON} className="node-item flex items-center relative group overflow-y-hidden">
                  
                  <div className="flex flex-col items-center">
                    
                    <button
                      onClick={() => navigate(`/learning/${lec.ID_LECON}`)}
                      className={`cg-node-btn ${nodeStyle}`}
                      title={lec.NOM_LECON}
                    >
                      <div className="cg-node-inner">
                        {isFinished ? (
                          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        ) : moduleActif ? (
                          <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                          </svg>
                        )}
                      </div>
                    </button>

                    <div className="cg-node-label mt-3 text-center">
                      <span className="text-[11px] font-black tracking-wider uppercase text-white block max-w-[110px] truncate">
                        {lec.NOM_LECON}
                      </span>
                      {moduleActif && !isFinished && (
                        <span className="text-[9px] font-bold text-amber-600 block truncate max-w-[110px]">
                          {moduleActif.NOM_MODULE}
                        </span>
                      )}
                    </div>
                  </div>

                  {!isLast && (
                    <div className={`cg-connector-line ${
                      isFinished 
                        ? 'line-orange' 
                        : moduleActif 
                        ? 'line-dotted' 
                        : 'line-gray'
                    }`} />
                  )}

                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* Fond DotField ajusté en couleurs claires */}
      <div className="path-container-chart absolute inset-0 z-0 pointer-events-none opacity-40">
        <DotField
          dotRadius={1.5}
          dotSpacing={35}
          bulgeStrength={16}
          glowRadius={60}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={400}
          cursorForce={0.01}
          bulgeOnly
          gradientFrom="#3b82f6"
          gradientTo="#f59e0b"
          glowColor="#ffffff"
        />
      </div>
    </div>
  );
}