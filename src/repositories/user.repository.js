import User from '../models/user.js';
import { USER_ROLES } from '../constants/index.js';

class UserRepository {
	static async getAll() {
		const users = await User.find();
		return users;
	}

	static async getById(id) {
		const user = await User.findById(id);
		return user;
	}

	static async create({ name, email, role, password }) {
		const user = await User.create({
			name,
			email,
			role: role || USER_ROLES.USER,
			passwordHash: password,
		});

		return user;
	}

	static async insertMany(users) {
		const newUsers = await User.insertMany(users);
		return newUsers;
	}
}

export default UserRepository;
