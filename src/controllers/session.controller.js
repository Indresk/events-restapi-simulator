import { SESSION_NAME, sessionConfig } from '../config/cookies.js';
import { CurrentUserDTO } from '../dto/index.js';
import { createToken } from '../utils/jwt.js';
import successFormatter from '../utils/successFormatter.js';

class SessionController {
	static async register(req, res, next) {
		try {
			const userPayload = new CurrentUserDTO(req.user);

			res
				.status(200)
				.json(successFormatter(userPayload, 'Usuario registrado exitosamente'));
		} catch (error) {
			next(error);
		}
	}

	static async logIn(req, res, next) {
		try {
			const userPayload = new CurrentUserDTO(req.user);

			const token = createToken(userPayload);
			res.cookie(SESSION_NAME, token, sessionConfig);
			res.status(200).json(successFormatter(userPayload, 'Login exitoso'));
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
			const { _id: id, email, role } = req.user;
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
