import express from 'express';
import EventController from '../controllers/event.controller.js';
import TicketController from '../controllers/ticket.controller.js';
import {
	authenticate,
	optionalAuthenticate,
} from '../middlewares/auth.middleware.js';
import {
	authorize,
	authorizeEventOwnerOrAdmin,
} from '../middlewares/authorize.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = express.Router();

router.get('/', optionalAuthenticate, EventController.getAll);
router.get('/:id', optionalAuthenticate, EventController.getById);

router.post(
	'/',
	authenticate,
	authorize(...PERMISSIONS.EVENTS_CREATE),
	EventController.create,
);

// modificar / cambiar estado: organizer sobre sus eventos, admin sobre cualquiera
router.put(
	'/:id',
	authenticate,
	authorize(...PERMISSIONS.EVENTS_UPDATE_OWN),
	authorizeEventOwnerOrAdmin,
	EventController.update,
);
router.patch(
	'/:id/status',
	authenticate,
	authorize(...PERMISSIONS.EVENTS_UPDATE_OWN),
	authorizeEventOwnerOrAdmin,
	EventController.updateStatus,
);

router.post('/:eid/tickets', authenticate, TicketController.create);
router.get(
	'/:eid/tickets',
	authenticate,
	authorize(...PERMISSIONS.EVENTS_READ_TICKETS),
	authorizeEventOwnerOrAdmin,
	TicketController.getByEvent,
);

export default router;
