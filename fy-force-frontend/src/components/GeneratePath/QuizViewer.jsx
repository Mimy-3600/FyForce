import { useState, useEffect } from 'react';

export default function QuizViewer({ userEmail, onClose, onComplete }) {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  // 1. Récupération des quiz de l'utilisateur depuis ton backend Express
  useEffect(() => {
    const fetchUserQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/lesson/users/${userEmail}/quizzes`);
        const data = await response.json();

        if (response.ok && data.data && data.data.length > 0) {
          setQuizzes(data.data);
        } else if (Array.isArray(data) && data.length > 0) {
          setQuizzes(data);
        } else {
          setError("Aucun quiz disponible pour le moment.");
        }
      } catch (err) {
        console.error("Erreur chargement quiz :", err);
        setError("Impossible de charger les quiz.");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchUserQuizzes();
    }
  }, [userEmail]);

  // Quiz & Question en cours
  const currentQuiz = quizzes[currentQuizIndex];
  const questions = currentQuiz?.questions || currentQuiz?.QUESTIONS || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Gestion du choix d'une réponse
  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  // Passer à la question suivante ou terminer
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateScore();
      setIsFinished(true);
      if (onComplete) onComplete();
    }
  };

  // Calcul du score simple (si la propriété estReponseCorrecte existe sur l'option)
  const calculateScore = () => {
    let pts = 0;
    questions.forEach((q, qIdx) => {
      const selectedOptIdx = selectedAnswers[qIdx];
      const options = q.options || q.OPTIONS || [];
      if (selectedOptIdx !== undefined && options[selectedOptIdx]?.isCorrect) {
        pts += 1;
      }
    });
    setScore(pts);
  };

  // --- RENDU : CHARGEMENT & ERREUR ---
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Chargement de ton quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !currentQuiz) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm text-center">
          <p className="text-gray-800 font-bold mb-3">{error || "Aucun quiz trouvé."}</p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  // --- RENDU : VUE DE FIN + STREAK BADGE 3J ---
  if (isFinished) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
          {/* Effet lumineux de fond */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-300/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />

          {/* BADGE STREAK 3 JOURS */}
          <div className="relative z-10 mx-auto w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 ring-4 ring-orange-100 mb-4 animate-bounce">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 23c-4.97 0-9-3.58-9-8 0-4.19 3.01-7.12 6.01-10.03.86-.84 1.73-1.69 2.49-2.61.18-.22.46-.36.75-.36s.57.14.75.36c.76.92 1.63 1.77 2.49 2.61C18.49 7.88 21 10.81 21 15c0 4.42-4.03 8-9 8z" />
            </svg>
            <span className="absolute -bottom-1 bg-white text-orange-600 font-black text-[10px] px-2 py-0.5 rounded-full border border-orange-200 shadow-sm">
              🔥 3 Jours
            </span>
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-1">Quiz Terminé !</h3>
          <p className="text-sm text-gray-500 mb-4">
            Tu as obtenu <span className="font-bold text-orange-600">{score} / {questions.length}</span> bonnes réponses.
          </p>

          <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl mb-6">
            <p className="text-xs font-bold text-orange-700">🎉 Série maintenue !</p>
            <p className="text-[11px] text-orange-600">Tu viens de valider ton 3ᵉ jour consécutif d'apprentissage.</p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Continuer
          </button>
        </div>
      </div>
    );
  }

  // --- RENDU : QUESTION EN COURS ---
  const options = currentQuestion?.options || currentQuestion?.OPTIONS || [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Entête du Quiz */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <div>
            <h4 className="font-bold text-gray-800 text-sm">{currentQuiz.TITRE || currentQuiz.title || "Quiz d'évaluation"}</h4>
            <span className="text-[11px] text-gray-400 font-medium">
              Question {currentQuestionIndex + 1} sur {questions.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 rounded-lg hover:bg-gray-200 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-100 h-1.5">
          <div
            className="bg-orange-500 h-1.5 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question & Options */}
        <div className="p-6 flex-1">
          <p className="text-base font-bold text-gray-800 mb-6">
            {currentQuestion?.question || currentQuestion?.QUESTION_TEXT || currentQuestion?.TITRE}
          </p>

          <div className="flex flex-col gap-3">
            {options.map((opt, idx) => {
              const optionText = typeof opt === 'string' ? opt : opt.texte || opt.TEXTE;
              const isSelected = selectedAnswers[currentQuestionIndex] === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm ring-1 ring-orange-400'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{optionText}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pied de page / Bouton Suivant */}
        <div className="p-4 border-t border-gray-100 bg-slate-50 flex justify-end">
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              selectedAnswers[currentQuestionIndex] !== undefined
                ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Question suivante →' : 'Terminer le Quiz'}
          </button>
        </div>

      </div>
    </div>
  );
}