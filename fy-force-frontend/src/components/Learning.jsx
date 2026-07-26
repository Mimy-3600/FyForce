import React, {useState} from "react"
import LessonList from './LessonList'
import ModelViewer from './ModelViewer'
import ProgressBar from'./ProgressBar'

export default function Learning({lessonsData}){
    const [lessons, setLessons] = useState(lessonsData);
    const [selectedLesson, setSelectedLesson] = useState(null); // Singulier
    const [activeModule, setActiveModule] = useState(null);
    const [newLessonTitle, setNewLessonTitle] = useState("");

    //marquage de module complete
    const toggleModuleComplete = (lessonId, moduleId) => { 
        const updateLessons = lessons.map(lesson => {
            if(lesson.id === lessonId){
                return {
                    ...lesson,
                    modules: lesson.modules.map(mod =>
                        mod.id === moduleId ? {...mod, completed: !mod.completed} : mod
                    )
                }
            }
            return lesson;
        });
        setLessons(updateLessons);
    };

    //ajouter une nouvelle leçon
    const handleAddLesson = (e) => {
        e.preventDefault();
        if (!newLessonTitle.trim()) return;

        const newLesson = {
            id: Date.now(), // ID unique basé sur le timestamp
            title: newLessonTitle,
            modules: [
                { id: Date.now() + 1, title: "Module 1: Introduction", completed: false }
            ]
        };

        setLessons([...lessons, newLesson]);
        setNewLessonTitle(""); // Réinitialisation d'input
    };

    //suppression d'une leçon
    const handleDeleteLesson = (lessonId) => {
        setLessons(lessons.filter(lesson => lesson.id !== lessonId));
        // sychronistaion sur module supprimé actif
        if (selectedLesson?.id === lessonId) {
            setSelectedLesson(null);
            setActiveModule(null);
        }
    };

    return (
        <div className="learning-container">
            <h2>Apprentissage</h2>
            <ProgressBar lessons={lessons}/>

            {/* Formulaire d'ajout de leçon */}
            <form onSubmit={handleAddLesson} className="add-lesson-form">
                <input 
                    type="text" 
                    placeholder="Titre de la nouvelle leçon..."
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    className="lesson-input"
                />
                <button type="submit" className="btn-add">Ajouter une leçon</button>
            </form>

            <div className="learning-layout">
                <LessonList 
                    lessons={lessons}
                    onSelectedModule={(lesson, module) =>{
                        setSelectedLesson(lesson); 
                        setActiveModule(module);
                    }}
                    onDeleteLesson={handleDeleteLesson}
                />
                {activeModule && (
                    <ModelViewer
                        lesson={selectedLesson}
                        module={activeModule}
                        onToggleComplete={() => 
                            toggleModuleComplete(selectedLesson.id, activeModule.id)
                        }
                    />
                )}
            </div>
        </div>
    );
}