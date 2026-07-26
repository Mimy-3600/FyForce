import { Router } from 'express';
import * as artefactController from '../controllers/artefactController.js';

const router = Router();

// --- 1. Routes statiques (GET) ---
router.get('/types', artefactController.getAllArtefactTypes);
// --- 2. Routes d'action (POST) ---
router.post('/craft', artefactController.craftArtefact);
router.post('/module/drop', artefactController.dropArtefactFromModule);
// --- 3. Routes avec paramètres dynamiques (:id, :email) ---
router.get('/:id/details', artefactController.getArtefactDetails);
router.get('/:email/artefacts', artefactController.getUserArtefacts); 
router.put('/changeOwner', artefactController.exchangeArtefact); 


export default router;