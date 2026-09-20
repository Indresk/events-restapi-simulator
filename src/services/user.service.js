import mongoose from 'mongoose';
import { USER_ROLES } from '../constants/index.js';
import AppError from '../errors/app.error.js';
import UserRepository from '../repositories/user.repository.js';
import ERROR_CODES from '../errors/error.codes.js';
import { emailSchema, passwordSchema } from '../utils/zodSchemas.js';
import { createHash } from '../utils/hashing.js';

class UserService {
	static async getAll() {
		const users = await UserRepository.getAll();
		return users;
	}

	static async getById(id) {
		if (!id)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'Falta id del usuario a buscar',
			);

		if (!mongoose.isValidObjectId(id)) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`El id proporcionado no es válido`,
			);
		}

		const user = await UserRepository.getById(id);
		if (!user) throw new AppError(ERROR_CODES.USER_NOT_FOUND);
		return user;
	}

	static async getByEmail(email) {
		if (!email)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'Falta el email del usuario a buscar',
			);

		if (!emailSchema.safeParse(email).success) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`El email proporcionado no es válido`,
			);
		}

		const user = await UserRepository.getByEmail(email);
		if (!user) throw new AppError(ERROR_CODES.USER_NOT_FOUND);
		return user;
	}

	static async create({ first_name, last_name, email, password }) {
		if (!first_name || !last_name || !email || !password) {
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

		if (userStatus) throw new AppError(ERROR_CODES.USER_ALREADY_EXISTS);

		if (!passwordSchema.validate(password))
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`La contraseña proporcionada no cumple las caracteristicas necesarias.`,
			);

		const passwordHashed = await createHash(password);

		const user = await UserRepository.create({
			first_name,
			last_name,
			email,
			password: passwordHashed,
		});

		return user.toObject();
	}

	static async updateRole({ id, role }) {
		if (!id || !role) {
			throw new AppError(ERROR_CODES.BAD_REQUEST, 'Faltan datos requeridos');
		}

		if (!mongoose.isValidObjectId(id)) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`El id proporcionado no es válido`,
			);
		}

		const validRoles = Object.values(USER_ROLES);
		const roleExist = validRoles.find((userRole) => userRole === role);
		if (!roleExist) throw new AppError(ERROR_CODES.INVALID_USER_ROLE);

		const user = await UserRepository.updateRole({
			id,
			role,
		});

		return user.toObject();
	}
}

export default UserService;
