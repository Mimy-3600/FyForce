import React, { useState, useEffect } from "react";

export default function ModelViewer({ lesson, module, onToggleComplete }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchChatBotContents() {
            setLoading(true);

            try {
                const response = await fetch('/api/chatbot/generate-module', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lessonTitle: lesson?.title,
                        moduleTitle: module?.title
                    })
                });
                const data = await response.json();
                setContent(data.content);
            } catch {
                setContent("Erreur lors de la génération du contenu");
            } finally {
                setLoading(false);
            }
        }
        
        if (module) {
            fetchChatBotContents();
        }
    }, [module, lesson]);

    return (
        <div className="module-content">
            <h3>{module.title}</h3>
            
            {loading ? (
                <p>Chargement du contenu......</p>
            ) : (
                <div className="body">{content}</div>
            )}

            {/* Marquage de module complet */}
            <button 
                className={`btn-complete ${module.completed ? 'done' : ''}`}
                onClick={onToggleComplete}
            >
                {module.completed ? 'Marquer comme non terminé' : 'Marquer comme terminé'}
            </button>
        </div>
    );
} 