import express from 'express';
import UserController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import SessionController from '../controllers/session.controller.js';
const router = express.Router();

router.post('/register', UserController.create);

router.post('/login', SessionController.logIn);
router.post('/logout', SessionController.logOut);

router.use(authMiddleware); // Rutas protegidas debajo

router.get('/current', SessionController.current);

export default router;

// router.post('/logout', authMiddleware, SessionController.logOut);
// router.post('/current', authMiddleware, SessionController.current);
