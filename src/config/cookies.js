import { ENVIRONMENT } from '../constants/index.js';
import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes.js';
import config from './index.js';

export const SESSION_NAME = 'currentUser';
const MAX_AGE = 60 * 60 * 1000;

export const sessionConfig = {
	httpOnly: true,
	maxAge: MAX_AGE,
	sameSite: 'lax',
	secure: config.NODE_ENV === ENVIRONMENT.PROD,
};

export function cookieExtractor(req) {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies[SESSION_NAME];
		if (!token) throw new AppError(ERROR_CODES.NOT_AUTHENTICATED);
	}
	return token;
}
