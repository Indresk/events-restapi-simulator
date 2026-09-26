import * as jwt from 'jsonwebtoken';
import config from '../config/index.js';
import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes';

export function verifyToken(token) {
	try {
		const decoded = jwt.verify(token);
		return decoded;
	} catch (error) {
		throw new AppError(ERROR_CODES.INVALID_TOKEN);
	}
}

export function createToken(payload) {
	const token = jwt.sign(payload, config.JWT_TOKEN);
	return token;
}
