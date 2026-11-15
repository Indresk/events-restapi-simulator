// Crea el primer admin (o promueve al usuario existente con ADMIN_EMAIL)
import { USER_ROLES } from '../constants/index.js';
import UserRepository from '../repositories/user.repository.js';
import { emailSchema } from '../utils/zodSchemas.js';
import { ensureUser, runIfMain } from './helpers.js';

export async function seedAdmin() {
	const {
		ADMIN_EMAIL,
		ADMIN_PASSWORD,
		ADMIN_FIRST_NAME = 'Admin',
		ADMIN_LAST_NAME = 'Root',
	} = process.env;

	if (!ADMIN_EMAIL || !ADMIN_PASSWORD)
		throw new Error(
			'Faltan las variables ADMIN_EMAIL y/o ADMIN_PASSWORD en el .env',
		);

	const email = emailSchema.safeParse(ADMIN_EMAIL);
	if (!email.success) throw new Error('ADMIN_EMAIL no es un email válido');

	const existing = await UserRepository.getByEmail(email.data);

	if (existing) {
		await UserRepository.updateRole({
			id: existing._id,
			role: USER_ROLES.ADMIN,
		});
		console.info(`Usuario ${email.data} asignado como admin.`);
		return existing;
	}

	return ensureUser({
		first_name: ADMIN_FIRST_NAME,
		last_name: ADMIN_LAST_NAME,
		email: email.data,
		password: ADMIN_PASSWORD,
		role: USER_ROLES.ADMIN,
	});
}

runIfMain(import.meta.url, seedAdmin);
