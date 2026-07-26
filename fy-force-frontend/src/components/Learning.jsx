import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LessonList from './LessonList';
import ModelViewer from './ModelViewer';
import ProgressBar from './ProgressBar';

export default function Learning() {
    const { idLesson } = useParams(); // Récupère l'ID depuis la route /learning/:idLesson
    
    const [lesson, setLesson] = useState(null);
    const [activeModule, setActiveModule] = useState(null);
    const [loading, setLoading] = useState(false);

    // Charge uniquement la leçon en cours depuis l'API
    useEffect(() => {
        if (!idLesson) return;

        const fetchLesson = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:3000/api/lesson/${idLesson}`);
                const responseData = await res.json();

                if (res.ok && responseData.data) {
                    const loadedData = responseData.data;

                    const formattedLesson = {
                        id: loadedData.ID_LECON,
                        title: loadedData.NOM_LECON,
                        completed: loadedData.TERMINE === 1,
                        modules: (loadedData.MODULES || []).map(m => ({
                            id: m.ID_MODULE,
                            title: m.NOM_MODULE,
                            completed: m.FINI === 1
                        }))
                    };

                    setLesson(formattedLesson);
                    
                    // Sélectionne automatiquement le 1er module par défaut
                    if (formattedLesson.modules.length > 0) {
                        setActiveModule(formattedLesson.modules[0]);
                    }
                }
            } catch (err) {
                console.error("Erreur lors du chargement de la leçon :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [idLesson]);

    // Marquage d'un module comme complété / non complété
    const toggleModuleComplete = async (moduleId) => { 
        try {
            await fetch(`http://localhost:3000/api/module/${moduleId}/complete`, {
                method: 'PUT'
            });

            // Met à jour la leçon unique
            setLesson(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    modules: prev.modules.map(mod =>
                        mod.id === moduleId ? { ...mod, completed: !mod.completed } : mod
                    )
                };
            });

            // Met à jour le module actif
            if (activeModule && activeModule.id === moduleId) {
                setActiveModule(prev => ({ ...prev, completed: !prev.completed }));
            }
        } catch (err) {
            console.error("Erreur lors du changement d'état du module :", err);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-white">Chargement de la leçon...</div>;
    }

    if (!lesson) {
        return <div className="p-8 text-center text-white">Aucune leçon trouvée.</div>;
    }

    return (
        <div className="learning-container">
            <h2>{lesson.title}</h2>
            
            {/* ProgressBar reçoit le tableau contenant uniquement la leçon active */}
            <ProgressBar lessons={[lesson]} />

            <div className="learning-layout">
                {/* On passe uniquement la leçon actuelle sous forme de tableau à LessonList */}
                <LessonList 
                    lessons={[lesson]}
                    onSelectedModule={(_, module) => {
                        setActiveModule(module);
                    }}
                />
                
                {activeModule && (
                    <ModelViewer
                        lesson={lesson}
                        module={activeModule}
                        onToggleComplete={() => toggleModuleComplete(activeModule.id)}
                    />
                )}
            </div>
        </div>
    );
}