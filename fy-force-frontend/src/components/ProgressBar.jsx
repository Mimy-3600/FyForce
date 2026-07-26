import React from "react";

export default function ProgressBar({lessons}){
    const allModules = lessons.flatMap(l => l.modules)
    const completedCount = allModules.filter(m => m.completed).length
    const percentage =  allModules.length > 0 ? Math.round((completedCount / allModules.length) * 100) : 0

    return (
    <div className="progress-section">
      <p>Progression globale : {percentage}% ({completedCount}/{allModules.length} modules)</p>
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}