import express from 'express';
import EventController from '../controllers/event.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
	authorize,
	authorizeEventOwnerOrAdmin,
} from '../middlewares/authorize.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = express.Router();

// solo devuelven eventos con status 'published'
router.get('/', EventController.getAll);
router.get('/:id', EventController.getById);

// crear eventos
router.post(
	'/',
	authenticate,
	authorize(...PERMISSIONS.EVENTS_CREATE),
	EventController.create,
);

// modificar / cancelar: organizer sobre sus eventos, admin sobre cualquiera
router.patch(
	'/:id',
	authenticate,
	authorize(...PERMISSIONS.EVENTS_UPDATE_OWN),
	authorizeEventOwnerOrAdmin,
	EventController.update,
);
router.patch(
	'/:id/cancel',
	authenticate,
	authorize(...PERMISSIONS.EVENTS_UPDATE_OWN),
	authorizeEventOwnerOrAdmin,
	EventController.cancel,
);

export default router;
