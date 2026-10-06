import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes.js';

export function authorizationMiddleware(...roles) {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			throw new AppError(ERROR_CODES.NOT_AUTHORIZED);

		next();
	};
}
