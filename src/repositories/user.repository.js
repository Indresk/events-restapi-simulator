import UserDAO from '../dao/user.dao.js';

class UserRepository {
	static async getAll() {
		return await UserDAO.getAll();
	}

	static async getById(id) {
		return await UserDAO.getById(id);
	}

	static async getByEmail(email) {
		return await UserDAO.getByEmail(email);
	}

	static async create({ first_name, last_name, email, role, password }) {
		return await UserDAO.create({
			first_name,
			last_name,
			email,
			role,
			password,
		});
	}

	static async updateRole({ id, role }) {
		return await UserDAO.updateRole({ id, role });
	}

	static async insertMany(users) {
		return await UserDAO.insertMany(users);
	}
}

export default UserRepository;
