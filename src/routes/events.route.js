import express from 'express';
import EventController from '../controllers/event.controller.js';
import {
	authorizationMiddleware,
	authorizeEventOwnerOrAdmin,
} from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../constants/index.js';
import passport from 'passport';

const router = express.Router();

router.get('/', EventController.getAll);
router.get('/:id', EventController.getById);
router.post('/', EventController.create);
router.patch(
	'/:id',
	passport.authenticate('current', {
		session: false,
	}),
	authorizationMiddleware(USER_ROLES.ADMIN, USER_ROLES.ORGANIZER),
	authorizeEventOwnerOrAdmin,
	EventController.updateStatus,
);
router.patch(
	'/:id',
	passport.authenticate('current', {
		session: false,
	}),
	authorizationMiddleware(USER_ROLES.ADMIN, USER_ROLES.ORGANIZER),
	authorizeEventOwnerOrAdmin,
	EventController.addNewTickets,
);

export default router;
