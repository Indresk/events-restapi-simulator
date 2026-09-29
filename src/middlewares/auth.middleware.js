import { SESSION_NAME } from '../config/cookies.js';
import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes.js';
import { verifyToken } from '../utils/jwt.js';

export default function authMiddleware(req, res, next) {
	const token = req.cookies[SESSION_NAME];

	if (!token) throw new AppError(ERROR_CODES.NOT_AUTHENTICATED);
	const decoded = verifyToken(token);
	req.user = decoded;

	next();
}
