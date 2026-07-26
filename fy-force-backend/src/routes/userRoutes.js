
    import { Router } from 'express';
    import * as userController from '../controllers/userController.js';
    import upload from '../middlewares/upload.js';

    const router = Router();

    router.get('/', userController.getAll);
    router.get('/:id', userController.getOne);
    router.post('/register',upload.single('PHOTO_USER'), userController.create);
    router.post('/login', userController.login);
    router.put('/:id', userController.update);
    router.delete('/:id', userController.remove);

    export default router;
    