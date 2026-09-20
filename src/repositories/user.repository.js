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

	static async getByEmail(email) {
		const user = await User.findOne({ email });
		return user;
	}

	static async create({ first_name, last_name, email, role, password }) {
		const user = await User.create({
			first_name,
			last_name,
			email,
			role: role || USER_ROLES.USER,
			password,
		});

		return user;
	}

	static async updateRole({ id, role }) {
		const newUser = await User.findByIdAndUpdate(
			id,
			{ role },
			{ returnDocument: 'after' },
		);
		return newUser;
	}

	static async insertMany(users) {
		const newUsers = await User.insertMany(users);
		return newUsers;
	}
}

export default UserRepository;
