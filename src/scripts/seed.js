// Ejecuta todos los seeds en orden: admin, user, organizer, event, ticket
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { seedAdmin } from './seedAdmin.js';
import { seedUser } from './seedUser.js';
import { seedOrganizer } from './seedOrganizer.js';
import { seedEvent } from './seedEvent.js';
import { seedTicket } from './seedTicket.js';

try {
	await connectDB();
	await seedAdmin();
	await seedUser();
	await seedOrganizer();
	await seedEvent();
	await seedTicket();
} catch (error) {
	console.error(`Seed fallido: ${error.message}`);
	process.exitCode = 1;
} finally {
	await mongoose.disconnect();
}
