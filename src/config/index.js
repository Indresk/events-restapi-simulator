import dotenv from 'dotenv';
import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes.js';
dotenv.config();

const requiredEnvVars = [
	'NODE_ENV',
	'PORT',
	'MONGO_URL',
	'JWT_SECRET',
	'JWT_EXPIRES_IN',
];

for (const reqVar of requiredEnvVars) {
	if (!process.env[reqVar]) {
		throw new AppError(
			ERROR_CODES.CONFIG_ERROR,
			`No se puede iniciar la aplicación, hace falta la variable de entorno obligatoria: ${reqVar}`,
		);
	}
}

const config = Object.fromEntries(
	requiredEnvVars.map((key) => [key, process.env[key]]),
);

Object.freeze(config);

export default config;
