import 'dotenv/config';
import { GoogleGenAI} from '@google/genai';

/*const mess = express();
mess.use(express.json());*/

const ia = new GoogleGenAI({apikey: process.env.GEMINI_API_KEY});

mess.post('/api/chat-ai', async (req, res) => {
    const {prompt} = req.body;

    res.setHeader('Content-type', 'text/event-stream');
    res.setHeader('Cache-control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try{
        const reponse = await ia.models.generateContentStream({
             model: 'gemini-3.6-flash',
            content: prompt
        });

        for await (const morceau of reponse){
            const data = {text: morceau.text};

            res.write(`data:${JSON.stringify(data)}\n\n`);
            res.write('data:[DONE]\n\n');
            res.end();
        }
    }catch(erreur){
        console.log("Erreur:" + erreur);
        res.write(`data:${JSON.stringify({error: "une erreur est survenue"})}\n\n`);
        res.end();


    }
});
