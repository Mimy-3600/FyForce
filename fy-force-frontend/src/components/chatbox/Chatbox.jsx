import {useState, useRef, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';

export default function Chatbox(){
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [ecrire, setEcrire] = useState(false);
    const finchatRef = useRef(null);

    useEffect(() => {
        finchatRef.current?.scrollIntoView({behavior: 'smooth'});

    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if(!input.trim() || ecrire) return;

        const userMess = {sender: 'user', text: input};
        setMessages((prev) => [...prev, userMess]);
        setInput("");
        setEcrire(true);

        const aimess = messages.length + 1;
        setMessages((prev) => [...prev, {sender: 'ai', text: ""}]);

        try {
            const reponse = await fetch('http://localhost:3000/api/chat-ai', {
                method: 'POST',
                headers: {'Content-type' : 'application/json'},
                body: JSON.stringify({prompt : userMess.text})
            });
            const reader = reponse.body.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const {value, done} = await reader.read();
                if (done) break;

                const frag = decoder.decode(value);
                const lignes = frag.split('\n\n');

                for (const ligne of lignes) {
                    if(LineChart.startsWith('data: ')){
                        const raw = ligne.replace('data: ', '').trim();
                        if (raw === '[DONE]') {
                            setEcrire(false);
                            return;
                        }
                    }

                    try{
                        const parsed = JSON.parse(raw);
                        if(parsed.text) {
                            setMessages((prev) => {
                                const ajour = [...prev];
                                ajour[aimess].text += parsed.text;
                                return ajour;
                            })
                        }
                    } catch(erreur) {
                        console.log(erreur);
                    }
                }
            }
        }catch (erreur){
        setEcrire(false);

    }
    } 

    return (
    <div style={styles.container}>
      <div style={styles.header}>Discussion IA - FyForce</div>
      
      {/* Zone des messages */}
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.sender === 'user' ? styles.userRow : styles.aiRow}>
            <div style={msg.sender === 'user' ? styles.userBubble : styles.aiBubble}>
              <ReactMarkdown>{msg.text || "En train d'écrire..."}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question à l'IA..."
          style={styles.input}
          disabled={isTyping}
        />
        <button type="submit" style={styles.button} disabled={isTyping}>
          {isTyping ? "..." : "Envoyer"}
        </button>
      </form>
    </div>
);


};


const styles = {
  container: { maxWidth: '700px', margin: '30px auto', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', height: '80vh', backgroundColor: '#fff' },
  header: { padding: '15px', borderBottom: '1px solid #ddd', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' },
  chatBox: { flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#fdfdfd' },
  userRow: { display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' },
  aiRow: { display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' },
  userBubble: { backgroundColor: '#007bff', color: '#fff', padding: '12px 16px', borderRadius: '18px', borderBottomRightRadius: '2px', maxWidth: '75%', fontSize: '0.95rem' },
  aiBubble: { backgroundColor: '#e9ecef', color: '#333', padding: '12px 16px', borderRadius: '18px', borderBottomLeftRadius: '2px', maxWidth: '75%', fontSize: '0.95rem' },
  form: { display: 'flex', padding: '15px', borderTop: '1px solid #ddd', backgroundColor: '#fff', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' },
  input: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginRight: '10px', fontSize: '1rem', outline: 'none' },
  button: { padding: '12px 24px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }
};
