import express from 'express';
import UserController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = express.Router();

// Todas las rutas de usuarios son administrativas: solo admin.
router.get(
	'/',
	authenticate,
	authorize(...PERMISSIONS.USERS_READ_ALL),
	UserController.getAll,
);
router.get(
	'/:id',
	authenticate,
	authorize(...PERMISSIONS.USERS_READ_ALL),
	UserController.getById,
);
router.post(
	'/',
	authenticate,
	authorize(...PERMISSIONS.USERS_MANAGE),
	UserController.create,
);
router.patch(
	'/:id',
	authenticate,
	authorize(...PERMISSIONS.USERS_MANAGE),
	UserController.updateRole,
);

export default router;
