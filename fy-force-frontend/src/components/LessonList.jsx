import React, { useState } from "react";
import { X } from 'lucide-react';

export default function LessonList({ lessons, onSelectedModule, onDeleteLesson }) {
    const [openLessonId, setOpenLessonId] = useState(null);

    const toggleLesson = (id) => {
        setOpenLessonId(openLessonId === id ? null : id);
    };

    return (
        <div className="lessons-sidebar">
            <h3>Leçons</h3> 
            {lessons.map((lesson) => (
                <div key={lesson.id} className="lesson-container-item" style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                            className="lesson-header"
                            onClick={() => toggleLesson(lesson.id)}
                            style={{ flex: 1 }}
                        >
                            {lesson.title}
                        </button>
                        {/* Bouton de suppression de la leçon */}
                        <button 
                            type="button"
                            className="btn-delete-lesson"
                            onClick={() => {
                                onDeleteLesson(lesson.id)
                            }}
                            title="Supprimer la leçon"
                        >
                             <X color="#b30000"/> 
                        </button>
                    </div>

                    {openLessonId === lesson.id && (
                        <ul className="module-list">
                            {lesson.modules.map((mod) => ( 
                                <li
                                    key={mod.id}
                                    className={mod.completed ? 'completed' : ''}
                                    onClick={() => onSelectedModule(lesson, mod)}
                                >
                                    <span>{mod.completed ? 'ya' : 'wait '} {mod.title}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}