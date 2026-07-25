
    import { Router } from 'express';
    import * as userController from '../controllers/userController.js';

    const router = Router();

    router.get('/', userController.getAll);
    router.get('/:id', userController.getOne);
    router.post('/', userController.create);
    router.put('/:id', userController.update);
    router.delete('/:id', userController.remove);

    export default router;
    