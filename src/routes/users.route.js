import express from 'express';
import UserController from '../controllers/user.controller.js';
import passport from 'passport';
import { authorizationMiddleware } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';

const router = express.Router();

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post(
	'/',
	passport.authenticate('current', {
		session: false,
	}),
	authorizationMiddleware(USER_ROLES.ADMIN),
	UserController.create,
);
router.patch('/:id', UserController.updateRole);

export default router;
