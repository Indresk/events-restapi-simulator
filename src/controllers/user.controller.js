import UserService from '../services/user.service.js';
import successFormatter from '../utils/successFormatter.js';

class UserController {
	static async getAll(req, res, next) {
		try {
			const users = await UserService.getAll();

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
			const user = await UserService.getById(id);

			res
				.status(200)
				.json(successFormatter(user, 'Usuario obtenido con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async create(req, res, next) {
		try {
			const { first_name, last_name, email, password } = req.body;

			const user = await UserService.create({
				first_name,
				last_name,
				email,
				password,
			});

			res.status(201).json(successFormatter(user, 'Usuario creado con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async updateRole(req, res, next) {
		try {
			const { id } = req.params;
			const { role } = req.body;

			const user = await UserService.updateRole({
				id,
				role,
			});

			res
				.status(200)
				.json(successFormatter(user, 'Usuario actualizado con exito.'));
		} catch (error) {
			next(error);
		}
	}
}

export default UserController;
