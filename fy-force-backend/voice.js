import express from 'express';
import multer from 'multer';
import {HfInference} from '@huggingface/inference';
import translate from 'translate';
import dotenv from 'dotenv';

dotenv.config();

const appli = express();
const upload = multer();
const hf = new HfInference(process.env.HF_TOKEN);

translate.engine = 'nodetranslate';

appli.post('/api/voice-translate', upload.single(audio), async (req, res) => {
    try{
        if(!req.file) return res.status(400).json({error: ""})
    }
})