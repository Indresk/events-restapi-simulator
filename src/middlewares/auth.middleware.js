import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes.js';
import EventService from '../services/event.service.js';

export function authorizationMiddleware(...roles) {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			throw new AppError(ERROR_CODES.NOT_AUTHORIZED);

		next();
	};
}

export const authorizeEventOwnerOrAdmin = async (req, res, next) => {
	const { id } = req.params;
	const event = await EventService.getById(id);
	if (!event) throw new AppError(ERROR_CODES.NOT_FOUND);

	const isAdmin = req.user.role === 'admin';
	const isOwner = event.organizer.toString() === req.user._id.toString();
	if (!isAdmin && !isOwner) throw new AppError(ERROR_CODES.NOT_AUTHORIZED);

	req.event = event;
	next();
};
