import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes.js';
import UserRepository from '../repositories/user.repository.js';
import { isValidPassword } from '../utils/hash.js';
import { createToken } from '../utils/jwt.js';
import { emailSchema } from '../utils/zodSchemas.js';

class SessionService {
	static async logIn({ email, password }) {
		if (!email || !password) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'Faltan datos requeridos del usuario',
			);
		}

		if (!emailSchema.validate(email)) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`El email proporcionado no es válido`,
			);
		}

		const userStatus = await UserRepository.getByEmail(email);

		if (!userStatus) throw new AppError(ERROR_CODES.USER_NOT_FOUND);

		const {
			first_name,
			last_name,
			role,
			password: hashedPassword,
		} = userStatus;

		if (!(await isValidPassword(password, hashedPassword)))
			throw new AppError(ERROR_CODES.BAD_REQUEST, `Credenciales invalidas`);

		const userPayload = {
			first_name,
			last_name,
			email,
			role,
		};

		const token = createToken(userPayload);

		return token;
	}

	static async current({ email, password }) {
		return `hola || ${email} + ${password}`;
	}
}

export default SessionService;
