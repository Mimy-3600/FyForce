
    import { Router } from 'express';
    import * as itemController from '../controllers/itemController.js';

    const router = Router();

    router.get('/itemsUser/:email', itemController.getAll);
    router.get('/one/:id', itemController.getOne);
    router.post('/', itemController.create);


    export default router;
    