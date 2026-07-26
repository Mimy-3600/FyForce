import '../../style/Path.css'
import { useState, useRef, useEffect } from 'react'
import TextType from '../TextType'
import { Pickaxe } from 'lucide-react'

export default function GenPath() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      type: 'text',
      content: 'Bonjour ! Que souhaites-tu apprendre aujourd\'hui ? Saisis un thème (ex: "Apprends-moi les bases de Python") et je générerai un parcours personnalisé pour toi.'
    }
  ])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Scroll automatique vers le bas à chaque nouveau message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    const userQuery = prompt.trim()
    setPrompt('')

    // 1. Ajoute le message de l'utilisateur
    setMessages((prev) => [
      ...prev,
      { role: 'user', type: 'text', content: userQuery }
    ])

    setLoading(true)

    try {
      // 2. Appel API pour générer la leçon
      const genRes = await fetch('http://localhost:3000/api/lesson/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: userQuery })
      })

      const genData = await genRes.json()

      if (!genData?.data?.idLecon) {
        throw new Error('Impossible de récupérer l\'identifiant de la leçon.')
      }

      const idLecon = genData.data.idLecon

      // 3. Appel API pour récupérer les détails de la leçon
      const lessonRes = await fetch(`http://localhost:3000/api/lesson/${idLecon}`)
      const lessonData = await lessonRes.json()

      // 4. Ajoute la réponse sous forme de carte interactive
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          type: 'lesson',
          content: lessonData.data
        }
      ])
    } catch (error) {
      console.error('Erreur lors de la génération :', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          type: 'text',
          content: 'Une erreur est survenue lors de la création de la leçon. Vérifie ton serveur backend et réessaie.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans pt-15" >

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
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg text-xs font-bold">
                <Pickaxe/>
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
                /* Affichage structuré du résultat (Cartes de Leçon & Modules) */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                        Parcours de Formation #{msg.content.ID_LECON}
                      </span>
                      <h2 className="text-base font-bold text-white mt-0.5">
                        {msg.content.NOM_LECON}
                      </h2>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {msg.content.MODULES?.length || 0} Modules
                    </span>
                  </div>

                  <div className="grid gap-2.5">
                    {msg.content.MODULES?.map((mod) => (
                      <div
                        key={mod.ID_MODULE}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono text-indigo-300 border border-slate-700">
                            N{mod.NIVEAU_MODULE}
                          </span>
                          <span className="text-xs font-medium text-slate-200 group-hover:text-indigo-200 transition-colors">
                            {mod.NOM_MODULE}
                          </span>
                        </div>
                        
                        <span className="text-[10px] text-slate-500 font-mono">
                          {mod.FINI ? "Terminé" : "En attente"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Indicateur de génération (Réfléchit...) */}
        {loading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 animate-pulse text-xs">
              ✨
            </div>
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Génération de la leçon en cours...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Barre d'entrée Prompt (Style Gemini) */}
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