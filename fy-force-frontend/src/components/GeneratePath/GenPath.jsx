import '../../style/Path.css'
import { useState, useRef, useEffect } from 'react'
import TextType from '../TextType'
import { Pickaxe, Trash2, Plus, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom';


export default function GenPath() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      type: 'text',
      content: "Bonjour ! Que souhaites-tu apprendre aujourd'hui ? Saisis un thème (ex: \"Apprends-moi les bases de Python\") et je générerai un plan à personnaliser."
    }
  ])
  
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  // =========================================================================
  // 1. GENERER UN PLAN INITIAL (PREPARATION)
  // =========================================================================
  const [activePlan, setActivePlan] = useState(null)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || loading) return
  
    const userQuery = prompt.trim()
    setPrompt('')
  
    // Ajoute le message utilisateur
    const newMessages = [...messages, { role: 'user', type: 'text', content: userQuery }]
    setMessages(newMessages)
    setLoading(true)
  
    try {
      // On envoie le nouveau message, le plan actuel ET l'historique pour garder la mémoire
      const res = await fetch('http://localhost:3000/api/lesson/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          theme: userQuery,
          currentPlan: activePlan, // Le plan déjà généré si présent
          history: newMessages.map(m => ({ role: m.role, content: m.content })) // Historique de conversation
        })
      })
  
      const responseData = await res.json()
      const updatedPlan = responseData?.data
  
      if (updatedPlan && updatedPlan.modules) {
        // Mise à jour de la mémoire du plan dans l'état local
        setActivePlan(updatedPlan)
  
        // Affichage du plan mis à jour dans le Chat
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            type: 'custom_plan',
            content: updatedPlan
          }
        ])
      } else {
        // Si la réponse est un simple message explicatif sans modification du plan
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            type: 'text',
            content: responseData.message || "Je n'ai pas pu modifier le plan. Peux-tu préciser ?"
          }
        ])
      }
    } catch (error) {
      console.error('Erreur :', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          type: 'text',
          content: 'Une erreur est survenue lors de la communication avec l\'assistant.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }
  
  const handleConfirmPlan = async (msgIndex) => {
    const targetPlan = messages[msgIndex].content;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/lesson/save-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: targetPlan.theme,
          modules: targetPlan.modules
        })
      });

      const result = await res.json();

      if (res.ok && result.data?.idLecon) {
        // Redirection directe vers la page de la leçon créée !
        navigate(`/learning/${result.data.idLecon}`);
      }
    } catch (error) {
      console.error('Erreur lors de la validation :', error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // 2. MODIFIER LE PLAN DANS LE CHAT
  // =========================================================================
  const handleUpdateModuleName = (msgIndex, moduleIdx, newName) => {
    setMessages((prev) => {
      const updated = [...prev]
      const plan = { ...updated[msgIndex].content }
      plan.modules[moduleIdx].nom = newName
      updated[msgIndex].content = plan
      return updated
    })
  }

  const handleRemoveModule = (msgIndex, moduleIdx) => {
    setMessages((prev) => {
      const updated = [...prev]
      const plan = { ...updated[msgIndex].content }
      plan.modules = plan.modules.filter((_, idx) => idx !== moduleIdx)
      updated[msgIndex].content = plan
      return updated
    })
  }

  const handleAddModule = (msgIndex) => {
    setMessages((prev) => {
      const updated = [...prev]
      const plan = { ...updated[msgIndex].content }
      plan.modules.push({
        nom: "Nouveau module",
        contenu: "Contenu du module à définir...",
        niveau_difficulte: 1
      })
      updated[msgIndex].content = plan
      return updated
    })
  }


  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans pt-15">

      {/* Zone de discussion */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-4 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >

            {/* Avatar Assistant */}
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg text-xs font-bold text-white">
                <Pickaxe className="w-4 h-4" />
              </div>
            )}

            {/* Bulle de Message */}
            <div
              className={`max-w-[85%] rounded-2xl p-4 transition-all ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-slate-100 rounded-tr-none border border-slate-700/60'
                  : 'bg-slate-900/80 text-slate-200 border border-slate-800/80 shadow-md rounded-tl-none'
              }`}
            >
              {msg.type === 'text' ? (
                <TextType 
                  text={[msg.content]}
                  loop={false}
                  typingSpeed={10}
                />
              ) : (
                /* Plan personnalisable */
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                        {msg.content.isConfirmed ? "Parcours Validé" : "Brouillon de Parcours"}
                      </span>
                      <h2 className="text-base font-bold text-white mt-0.5">
                        {msg.content.theme}
                      </h2>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {msg.content.modules?.length || 0} Modules
                    </span>
                  </div>

                  {/* Liste Éditable des Modules */}
                  <div className="grid gap-2.5">
                    {msg.content.modules?.map((mod, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono text-indigo-300 border border-slate-700 shrink-0">
                            N{mod.niveau_difficulte || 1}
                          </span>
                          
                          {msg.content.isConfirmed ? (
                            <span className="text-xs font-medium text-slate-200">
                              {mod.nom}
                            </span>
                          ) : (
                            <input
                              type="text"
                              value={mod.nom}
                              onChange={(e) => handleUpdateModuleName(idx, mIdx, e.target.value)}
                              className="bg-transparent border-b border-slate-700 focus:border-indigo-400 text-xs text-slate-200 font-medium focus:outline-none w-full py-0.5"
                            />
                          )}
                        </div>

                        {!msg.content.isConfirmed && (
                          <button
                            onClick={() => handleRemoveModule(idx, mIdx)}
                            className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                            title="Supprimer ce module"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Actions de Personnalisation */}
                  {!msg.content.isConfirmed && (
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800/60">
                      <button
                        onClick={() => handleAddModule(idx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Ajouter un module
                      </button>

                      <button
                        onClick={() => handleConfirmPlan(idx)}
                        disabled={loading || msg.content.modules.length === 0}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-medium shadow-md transition-all cursor-pointer disabled:opacity-40"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Valider ce parcours
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Animation de chargement */}
        {loading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 animate-pulse text-xs text-white font-bold">
              ✨
            </div>
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Traitement en cours...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input utilisateur */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Pose une question ou saisis un sujet d'apprentissage..."
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
          />
          
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="absolute right-2.5 p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all cursor-pointer"
          >
            <svg
              className="w-4 h-4 transform rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19V5m0 0l-7 7m7-7l7 7"
              />
            </svg>
          </button>
        </form>
      </div>

    </div>
  )
}