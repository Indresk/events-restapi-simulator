import { SESSION_NAME, sessionConfig } from '../config/cookies.js';
import SessionService from '../services/session.service.js';
import successFormatter from '../utils/successFormatter.js';

class SessionController {
	static async logIn(req, res, next) {
		try {
			const { email, password } = req.body;

			const loginData = await SessionService.logIn({ email, password });
			res.cookie(SESSION_NAME, loginData.token, sessionConfig);
			res
				.status(200)
				.json(successFormatter(loginData.userPayload, 'Login exitoso'));
		} catch (error) {
			next(error);
		}
	}

	static async logOut(req, res, next) {
		try {
			res.clearCookie(SESSION_NAME);
			res.status(200).json(successFormatter('', 'Logout correcto'));
		} catch (error) {
			next(error);
		}
	}

	static current(req, res, next) {
		try {
			const { id, email, role } = req.user;
			res
				.status(200)
				.json(
					successFormatter(
						{ id, email, role },
						'Información de sesión obtenida correctamente.',
					),
				);
		} catch (error) {
			next(error);
		}
	}
}

export default SessionController;
