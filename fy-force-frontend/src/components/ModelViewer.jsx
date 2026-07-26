import { useState, useEffect } from "react";

export default function ModelViewer({ lesson, module, onToggleComplete }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchModuleContent() {
            setLoading(true);

            try {
                console.log(module.id);
                
                // Récupération du module existant enregistré en BDD via son ID
                const response = await fetch(`http://localhost:3000/api/lesson/module/${module.id}`);
                const data = await response.json();

                if (response.ok && data.data) {
                    // On extrait le contenu enregistré en BDD (CONTENU_MODULE)
                    setContent(data.data.CONTENU_MODULE || data.data.contenu || "Aucun contenu disponible pour ce module.");
                } else {
                    setContent("Impossible de charger le contenu du module.");
                }
            } catch (err) {
                console.error("Erreur lors de la récupération du module :", err);
                setContent("Erreur de connexion au serveur.");
            } finally {
                setLoading(false);
            }
        }

        if (module?.id) {
            fetchModuleContent();
        }
    }, [module?.id]); // Ne re-déclenche le fetch que si l'ID du module change

    if (!module) {
        return <div className="module-content"><p>Veuillez sélectionner un module.</p></div>;
    }

    return (
        <div className="module-content">
            <h3>{module.title}</h3>
            
            {loading ? (
                <p>Chargement du contenu...</p>
            ) : (
                <div className="body" style={{ whiteSpace: 'pre-wrap' }}>
                    {content}
                </div>
            )}

            {/* Bouton de confirmation de fin de module */}
            <button 
                className={`btn-complete ${module.completed ? 'done' : ''}`}
                onClick={onToggleComplete}
            >
                {module.completed ? 'Marquer comme non terminé' : 'Marquer comme terminé'}
            </button>
        </div>
    );
}