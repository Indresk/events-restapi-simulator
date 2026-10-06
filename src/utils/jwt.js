import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes.js';

export function verifyToken(token) {
	try {
		const decoded = jwt.verify(token, config.JWT_SECRET);
		return decoded;
	} catch (error) {
		throw new AppError(ERROR_CODES.INVALID_TOKEN);
	}
}

export function createToken({ ...payload }) {
	const token = jwt.sign(payload, config.JWT_SECRET, {
		expiresIn: config.JWT_EXPIRES_IN,
	});
	return token;
}
