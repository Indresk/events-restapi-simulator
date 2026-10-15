import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes.js';
import { PERMISSIONS } from '../constants/permissions.js';
import EventService from '../services/event.service.js';

export function authorize(...allowedRoles) {
	return (req, res, next) => {
		if (!req.user) return next(new AppError(ERROR_CODES.NOT_AUTHENTICATED));

		if (!allowedRoles.includes(req.user.role))
			return next(new AppError(ERROR_CODES.NOT_AUTHORIZED));

		next();
	};
}

export async function authorizeEventOwnerOrAdmin(req, res, next) {
	try {
		if (!req.user) throw new AppError(ERROR_CODES.NOT_AUTHENTICATED);

		const event = await EventService.getById(req.params.id);

		const canUpdateAny = PERMISSIONS.EVENTS_UPDATE_ANY.includes(req.user.role);
		const isOwner = event.organizer.toString() === req.user._id.toString();

		if (!canUpdateAny && !isOwner)
			throw new AppError(
				ERROR_CODES.NOT_AUTHORIZED,
				'Solo el organizador del evento o un admin pueden modificarlo',
			);

		req.event = event;
		next();
	} catch (error) {
		next(error);
	}
}
