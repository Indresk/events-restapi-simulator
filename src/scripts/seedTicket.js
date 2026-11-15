// Inscribe al usuario de prueba al evento de prueba (sin enviar email)
import EventRepository from '../repositories/event.repository.js';
import TicketRepository from '../repositories/ticket.repository.js';
import { generateReservationCode } from '../utils/reservationCode.js';
import { SEED_EVENT, SEED_ORGANIZER, SEED_USER } from './seedData.js';
import { requireUser, runIfMain } from './helpers.js';

export async function seedTicket() {
	const user = await requireUser(SEED_USER.email, 'npm run seed:user');
	const organizer = await requireUser(
		SEED_ORGANIZER.email,
		'npm run seed:organizer',
	);

	const event = await EventRepository.getOne({
		title: SEED_EVENT.title,
		organizer: organizer._id,
	});
	if (!event) throw new Error('No existe el evento de prueba. Ejecutá antes: npm run seed:event');

	const existing = await TicketRepository.getActiveByUserAndEvent({
		userId: user._id,
		eventId: event._id,
	});
	if (existing) {
		console.info(`Ya existe un ticket activo (${existing.reservationCode}).`);
		return existing;
	}

	const ticket = await TicketRepository.create({
		user: user._id,
		event: event._id,
		quantity: 1,
		reservationCode: generateReservationCode(),
	});
	console.info(`Creado el ticket ${ticket.reservationCode}.`);
	return ticket;
}

runIfMain(import.meta.url, seedTicket);
