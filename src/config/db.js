import mongoose from 'mongoose';
import config from './index.js';
import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes.js';

async function connectDB() {
	try {
		await mongoose.connect(config.MONGO_URL);
		console.info('Conectado a MongoDB');
	} catch (error) {
		throw new AppError(
			ERROR_CODES.DATABASE_ERROR,
			'Error al conectar a MongoDB',
			error.message,
		);
	}
}

export default connectDB;
