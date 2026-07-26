import '../../style/Path.css'
import { useState, useRef, useEffect } from 'react'
import TextType from '../TextType'
import {
  Pickaxe,
  Sparkles,
  RotateCcw,
  User,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Send
} from 'lucide-react'

// --- Helpers ---------------------------------------------------------------

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function levelStyles(niveau) {
  const styles = {
    1: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    2: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    3: 'bg-violet-500/10 text-violet-300 border-violet-500/30'
  }
  return styles[niveau] || 'bg-rose-500/10 text-rose-300 border-rose-500/30'
}

// Heuristique légère : distingue une vraie question d'une demande de parcours.
// Par défaut (cas ambigu, ex: "Python"), on garde le comportement d'origine : génération de parcours.
const LESSON_KEYWORDS = [
  'apprends-moi', 'apprends moi', 'cours sur', 'cours de', 'parcours', 'formation',
  'initiation', 'les bases de', 'apprendre les bases', 'devenir', 'maîtrise', 'maitrise',
  'progresser en', "s'initier"
]
const QUESTION_STARTERS = [
  "qu'est-ce", 'pourquoi', 'comment', 'quand ', 'qui est', 'où ', 'combien',
  'quelle', 'quel est', 'explique', 'peux-tu', "c'est quoi", 'différence entre'
]

function detectIntent(text) {
  const t = text.toLowerCase().trim()
  if (LESSON_KEYWORDS.some((k) => t.includes(k))) return 'lesson'
  const looksLikeQuestion = t.endsWith('?') || QUESTION_STARTERS.some((k) => t.startsWith(k) || t.includes(` ${k}`))
  return looksLikeQuestion ? 'question' : 'lesson'
}

const QUICK_PROMPTS = [
  'Apprends-moi les bases de Python',
  'Introduction à React',
  'Fondamentaux du Machine Learning',
  'Les algorithmes de tri expliqués'
]

const INITIAL_GREETING = 'Bonjour ! Que souhaites-tu apprendre aujourd\'hui ? Saisis un thème (ex: "Apprends-moi les bases de Python") et je générerai un parcours personnalisé pour toi.'

// --- Sous-composant : carte de parcours -------------------------------------

function LessonCard({ lesson }) {
  const modules = lesson?.MODULES || []
  const done = modules.filter((m) => m.FINI).length
  const progress = modules.length ? Math.round((done / modules.length) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
            Parcours de Formation #{lesson.ID_LECON}
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">{lesson.NOM_LECON}</h2>
        </div>
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0">
          {modules.length} Modules
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
          <span>Progression</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-2.5">
        {modules.map((mod) => (
          <div
            key={mod.ID_MODULE}
            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex items-center justify-between group/mod"
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono border shrink-0 ${levelStyles(mod.NIVEAU_MODULE)}`}>
                N{mod.NIVEAU_MODULE}
              </span>
              <span className="text-xs font-medium text-slate-200 group-hover/mod:text-indigo-200 transition-colors">
                {mod.NOM_MODULE}
              </span>
            </div>
            {mod.FINI ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Composant principal ----------------------------------------------------

export default function GenPath() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([
    { id: uid(), role: 'assistant', type: 'text', content: INITIAL_GREETING, ts: Date.now() }
  ])
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!loading) inputRef.current?.focus()
  }, [loading])

  // Annule toute requête en cours si le composant est démonté
  useEffect(() => () => abortRef.current?.abort(), [])

  const handleCopy = (id, text) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500)
  }

  const handleReset = () => {
    abortRef.current?.abort()
    setMessages([{ id: uid(), role: 'assistant', type: 'text', content: INITIAL_GREETING, ts: Date.now() }])
    setPrompt('')
    setLoading(false)
    setLoadingStage('')
  }

  // Tente une réponse conversationnelle en streaming.
  // Hypothèse d'API : POST /api/chat/ask -> corps en flux (texte brut ou SSE "data: ...").
  // À adapter à ton backend. Si l'endpoint est absent ou en erreur, on bascule
  // automatiquement sur la génération de parcours (comportement d'origine préservé).
  const askQuestion = async (question, signal) => {
    const msgId = uid()
    setMessages((prev) => [
      ...prev,
      { id: msgId, role: 'assistant', type: 'text', content: '', streaming: true, ts: Date.now() }
    ])
    setLoadingStage('Réflexion en cours...')

    try {
      const res = await fetch('http://localhost:3000/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
        signal
      })

      if (!res.ok || !res.body) throw new Error('endpoint indisponible')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const ssePieces = chunk
          .split('\n')
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.replace(/^data:\s*/, ''))
          .join('')
        full += ssePieces || chunk
        setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, content: full } : m)))
      }

      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, streaming: false } : m)))
      return true
    } catch (err) {
      if (err.name === 'AbortError') return true
      setMessages((prev) => prev.filter((m) => m.id !== msgId))
      return false
    }
  }

  const generateLesson = async (theme, signal) => {
    setLoadingStage('Analyse du thème...')
    try {
      const genRes = await fetch('http://localhost:3000/api/lesson/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
        signal
      })

      const genData = await genRes.json()

      if (!genData?.data?.idLecon) {
        throw new Error("Impossible de récupérer l'identifiant de la leçon.")
      }

      setLoadingStage('Construction des modules...')
      const idLecon = genData.data.idLecon

      const lessonRes = await fetch(`http://localhost:3000/api/lesson/${idLecon}`, { signal })
      const lessonData = await lessonRes.json()

      setMessages((prev) => [
        ...prev,
        { id: uid(), role: 'assistant', type: 'lesson', content: lessonData.data, ts: Date.now() }
      ])
    } catch (err) {
      if (err.name === 'AbortError') return
      console.error('Erreur lors de la génération :', err)
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          type: 'error',
          content: 'Une erreur est survenue lors de la création de la leçon. Vérifie ton serveur backend et réessaie.',
          failedQuery: theme,
          ts: Date.now()
        }
      ])
    }
  }

  const retry = async (theme) => {
    if (loading || !theme) return
    setLoading(true)
    const controller = new AbortController()
    abortRef.current = controller
    await generateLesson(theme, controller.signal)
    setLoading(false)
    setLoadingStage('')
  }

  const sendMessage = async (rawQuery) => {
    const userQuery = (rawQuery || '').trim()
    if (!userQuery || loading) return

    setMessages((prev) => [...prev, { id: uid(), role: 'user', type: 'text', content: userQuery, ts: Date.now() }])
    setLoading(true)

    const controller = new AbortController()
    abortRef.current = controller

    if (detectIntent(userQuery) === 'question') {
      const answered = await askQuestion(userQuery, controller.signal)
      if (!answered) await generateLesson(userQuery, controller.signal)
    } else {
      await generateLesson(userQuery, controller.signal)
    }

    setLoading(false)
    setLoadingStage('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!prompt.trim() || loading) return
    const q = prompt
    setPrompt('')
    sendMessage(q)
  }

  const handleQuickPrompt = (text) => {
    if (loading) return
    sendMessage(text)
  }

  const isStreamingActive = messages.some((m) => m.streaming)

  return (
    <div className="relative flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans pt-15 overflow-hidden">
      <style>{`
        @keyframes msgFadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-enter { animation: msgFadeInUp 0.35s ease-out; }
      `}</style>

      {/* Halos d'ambiance */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      {/* En-tête */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Pickaxe className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white leading-tight">GenPath</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-slate-500">Assistant d'apprentissage</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            title="Nouvelle conversation"
            aria-label="Nouvelle conversation"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zone de discussion */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="sticky top-0 h-6 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-[1]" />

        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-950/40">
                  <Pickaxe className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              <div
                className={`msg-enter relative max-w-[85%] rounded-2xl p-4 transition-all duration-200 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600/90 text-white rounded-tr-sm shadow-lg shadow-indigo-950/30'
                    : msg.type === 'error'
                    ? 'bg-rose-950/30 text-rose-100 border border-rose-500/30 rounded-tl-sm'
                    : 'bg-slate-900/80 text-slate-200 border border-slate-800/80 shadow-md rounded-tl-sm'
                }`}
              >
                {msg.type === 'text' ? (
                  msg.streaming ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-indigo-400 align-middle animate-pulse" />
                    </p>
                  ) : (
                    <TextType text={[msg.content]} loop={false} typingSpeed={10} />
                  )
                ) : msg.type === 'error' ? (
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2 text-rose-200">
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="text-sm">{msg.content}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => retry(msg.failedQuery)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200 hover:bg-rose-500/20 transition-colors"
                    >
                      Réessayer
                    </button>
                  </div>
                ) : (
                  <LessonCard lesson={msg.content} />
                )}

                <div className="flex items-center justify-between mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`text-[10px] ${msg.role === 'user' ? 'text-indigo-200/70' : 'text-slate-500'}`}>
                    {formatTime(msg.ts)}
                  </span>
                  {msg.role === 'assistant' && msg.type === 'text' && !msg.streaming && msg.content && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      aria-label="Copier le message"
                      className="text-slate-500 hover:text-indigo-300 transition-colors"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </div>
              )}
            </div>
          ))}

          {/* Suggestions rapides (uniquement au démarrage) */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 pl-11">
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp}
                  type="button"
                  onClick={() => handleQuickPrompt(qp)}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  {qp}
                </button>
              ))}
            </div>
          )}

          {/* Indicateur de génération (masqué si un message est déjà en streaming) */}
          {loading && !isStreamingActive && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {loadingStage || 'Génération en cours...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Barre d'entrée */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Pose une question ou saisis un sujet d'apprentissage..."
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-800 rounded-full py-3.5 pl-5 pr-12 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            aria-label="Envoyer"
            className="absolute right-2.5 p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all cursor-pointer active:scale-95"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
        <p className="max-w-4xl mx-auto text-[10px] text-slate-600 text-center mt-2">
          Entrée pour envoyer
        </p>
      </div>
    </div>
  )
}