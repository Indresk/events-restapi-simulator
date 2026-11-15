import { pathToFileURL } from 'node:url';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import UserRepository from '../repositories/user.repository.js';
import { createHash } from '../utils/hash.js';
import { emailSchema, passwordSchema } from '../utils/zodSchemas.js';
import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes.js';

// Ejecuta `task` con conexión propia solo si el archivo se corrió directamente.
export function runIfMain(metaUrl, task) {
	if (process.argv[1] && pathToFileURL(process.argv[1]).href !== metaUrl) return;

	connectDB()
		.then(task)
		.catch((error) => {
			console.error(`Seed fallido: ${error.message}`);
			process.exitCode = 1;
		})
		.finally(() => mongoose.disconnect());
}

// Crea el usuario si no existe; si existe lo deja como está (idempotente).
export async function ensureUser({ first_name, last_name, email, password, role }) {
	const validEmail = emailSchema.safeParse(email);
	if (!validEmail.success) throw new Error(`Email inválido: ${email}`);

	const existing = await UserRepository.getByEmail(validEmail.data);
	if (existing) {
		console.info(`Ya existe ${validEmail.data}, se reutiliza.`);
		return existing;
	}

	const validPassword = passwordSchema.safeParse(password);
	if (!validPassword.success)
		throw new Error(`La contraseña de ${email} no cumple los requisitos`);

	const user = await UserRepository.create({
		first_name,
		last_name,
		email: validEmail.data,
		password: await createHash(validPassword.data),
		role,
	});
	console.info(`Creado ${validEmail.data} con rol ${role}.`);
	return user;
}

export async function requireUser(email, hint) {
	const user = await UserRepository.getByEmail(email);
	if (!user)
		throw new AppError(
			ERROR_CODES.USER_NOT_FOUND,
			`No existe ${email}. Ejecutá antes: ${hint}`,
		);
	return user;
}
