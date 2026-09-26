import { sessionConfig } from '../config/cookies.js';
import SessionService from '../services/session.service.js';
import successFormatter from '../utils/successFormatter.js';

class SessionController {
	static async logIn(req, res, next) {
		try {
			const { email, password } = req.body;

			const token = await SessionService.logIn({ email, password });
			res.cookie('session', token, sessionConfig);
			res.status(200).json(successFormatter({ email }, 'Login exitoso'));
		} catch (error) {
			next(error);
		}
	}

	static async logOut(req, res, next) {
		try {
			res.clearCookie('session');
			res.status(200).json(successFormatter('', 'Logout correcto'));
		} catch (error) {
			next(error);
		}
	}

	static current(req, res) {
		try {
			res.status(200).json(successFormatter('', 'hola'));
		} catch (error) {
			next(error);
		}
	}
}

export default SessionController;
