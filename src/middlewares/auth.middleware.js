import passport from 'passport';
import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes.js';

const TOKEN_ERRORS = [
	'JsonWebTokenError',
	'TokenExpiredError',
	'NotBeforeError',
];

export function authenticate(req, res, next) {
	passport.authenticate('current', { session: false }, (err, user, info) => {
		if (err) return next(err);

		if (!user) {
			const code = TOKEN_ERRORS.includes(info?.name)
				? ERROR_CODES.INVALID_TOKEN
				: ERROR_CODES.NOT_AUTHENTICATED;
			return next(new AppError(code));
		}

		req.user = user;
		next();
	})(req, res, next);
}
