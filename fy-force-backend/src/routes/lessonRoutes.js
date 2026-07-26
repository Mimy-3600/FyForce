
    import { Router } from 'express';
    import * as lessonController from '../controllers/lessonController.js';

    const router = Router();
// Génération d'une leçon via l'IA Gemini
router.post('/generate', lessonController.generateLesson);

// Lister toutes les leçons d'un user
router.get('/', lessonController.getAllLessons);



// Progression d'un utilisateur
router.get('/progress/:email', lessonController.getUserProgress);

// Récupérer les leçons d'un utilisateur
router.get('/user/:email', lessonController.getUserLessons);

// Récupérer une leçon + ses modules
router.get('/:id', lessonController.getLessonWithModules);

// Récupérer un module précis
router.get('/module/:id', lessonController.getModuleDetails);

// Prochain module non terminé
router.get('/:idLecon/next-module', lessonController.getNextUnfinishedModule);

// Marquer une leçon comme terminée pour un user
router.post('/complete-lesson', lessonController.completeLessonForUser);

// Marquer un module comme fini
router.put('/module/:id/complete', lessonController.completeModule);

export default router;
    