
    import { Router } from 'express';
    import * as matchController from '../controllers/matchController.js';

    const router = Router();

    router.post('/challenge', matchController.createMatch);

    // get user mail
    router.get('/stats/:email', matchController.getUserMatchStats);
    // Voir le résultat d'un match par son ID
    router.get('/:id/result', matchController.getMatchResult);
    router.get('/leaderboard/victory', matchController.getLeaderboardVictory);
    
    // Clôturer le match et distribuer la récompense (DONNER)
    router.post('/resolve', matchController.determineWinner);

    export default router;
    