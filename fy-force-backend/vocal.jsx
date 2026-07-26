import { useState, useEffect, useRef } from 'react';

export default function ecrire() {
  const [texte, setTexte] = useState('');
  const [ecoute, setEcoute] = useState(false);
  
  const reconnRef = useRef(null);

  useEffect(() => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const reconnaitre = new SpeechRecognition();
    reconnaitre.continuous = true;  
    reconnaitre.interimResults = true; 
    reconnaitre.lang = 'fr-FR'; 

    reconnaitre.onresult = async (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      
      const voix = finalTranscript || interimTranscript;
      setTexte(voix);

      
      if (finalTranscript) {
        translateText(finalTranscript);
      }
    };

    reconnaitre.onend = () => {
  
      if (ecoute) reconnaitre.start();
    };

    reconnRef.current = reconnaitre;
  }, [ecoute]);

  

  const toggleListening = () => {
    if (ecoute) {
      reconnRef.current.stop();
      setEcoute(false);
    } else {
      setTexte('');
  
      setEcoute(true);
      reconnRef.current.start();
    }
  };

  return (
    <div style={{}}>
     
      <button 
        onClick={toggleListening} 
        style={{
         
        }}
      >
       </button>

      
    </div>
  );
}
