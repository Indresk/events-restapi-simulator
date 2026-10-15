import UserService from '../services/user.service.js';
import successFormatter from '../utils/successFormatter.js';
import { UserDTO } from '../dto/index.js';

class UserController {
	static async getAll(req, res, next) {
		try {
			const users = (await UserService.getAll()).map(
				(user) => new UserDTO(user),
			);

			res
				.status(200)
				.json(successFormatter(users, 'Usuarios obtenidos con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async getById(req, res, next) {
		try {
			const { id } = req.params;
			const user = new UserDTO(await UserService.getById(id));

			res
				.status(200)
				.json(successFormatter(user, 'Usuario obtenido con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async create(req, res, next) {
		// solo el admin puede entrar a este controller
		try {
			const { first_name, last_name, email, password, role } = req.body;

			const user = new UserDTO(
				await UserService.create({
					first_name,
					last_name,
					email,
					password,
					role,
				}),
			);

			res.status(201).json(successFormatter(user, 'Usuario creado con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async updateRole(req, res, next) {
		try {
			const { id } = req.params;
			const { role } = req.body;

			const user = new UserDTO(
				await UserService.updateRole({
					id,
					role,
				}),
			);

			res
				.status(200)
				.json(successFormatter(user, 'Usuario actualizado con exito.'));
		} catch (error) {
			next(error);
		}
	}
}

export default UserController;
