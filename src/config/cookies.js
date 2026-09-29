import { ENVIRONMENT } from '../constants/index.js';
import config from './index.js';

export const SESSION_NAME = 'currentUser';
const MAX_AGE = 60 * 60 * 1000;

export const sessionConfig = {
	httpOnly: true,
	maxAge: MAX_AGE,
	sameSite: 'lax',
	secure: config.NODE_ENV === ENVIRONMENT.PROD,
};
