// Crea el primer admin
import mongoose from 'mongoose';
import config from '../config/index.js';
import connectDB from '../config/db.js';
import UserRepository from '../repositories/user.repository.js';
import { USER_ROLES } from '../constants/index.js';
import { createHash } from '../utils/hash.js';
import { emailSchema, passwordSchema } from '../utils/zodSchemas.js';

async function seedAdmin() {
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

	await connectDB();

	const existing = await UserRepository.getByEmail(email.data);

	if (existing) {
		await UserRepository.updateRole({
			id: existing._id,
			role: USER_ROLES.ADMIN,
		});
		console.info(`Usuario ${email.data} creado como admin`);
		return;
	}

	const password = passwordSchema.safeParse(ADMIN_PASSWORD);
	if (!password.success)
		throw new Error('ADMIN_PASSWORD no cumple los requisitos de contraseña');

	await UserRepository.create({
		first_name: ADMIN_FIRST_NAME,
		last_name: ADMIN_LAST_NAME,
		email: email.data,
		password: await createHash(password.data),
		role: USER_ROLES.ADMIN,
	});
	console.info(`Admin ${email.data} creado en ${config.NODE_ENV}.`);
}

seedAdmin()
	.catch((error) => {
		console.error(`No se pudo crear el admin: ${error.message}`);
		process.exitCode = 1;
	})
	.finally(() => mongoose.disconnect());
