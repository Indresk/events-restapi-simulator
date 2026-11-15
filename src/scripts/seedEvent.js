// Crea un evento publicado a futuro del organizer de prueba
import { EVENT_STATUS } from '../constants/index.js';
import EventRepository from '../repositories/event.repository.js';
import { SEED_EVENT, SEED_ORGANIZER } from './seedData.js';
import { requireUser, runIfMain } from './helpers.js';

export async function seedEvent() {
	const organizer = await requireUser(
		SEED_ORGANIZER.email,
		'npm run seed:organizer',
	);

	const existing = await EventRepository.getOne({
		title: SEED_EVENT.title,
		organizer: organizer._id,
	});
	if (existing) {
		console.info(`Ya existe el evento "${SEED_EVENT.title}", se reutiliza.`);
		return existing;
	}

	const { daysFromNow, ...data } = SEED_EVENT;
	const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);

	const created = await EventRepository.create({
		...data,
		date,
		organizer: organizer._id,
	});
	const event = await EventRepository.updateStatus({
		id: created._id,
		status: EVENT_STATUS.PUBLISHED,
	});
	console.info(`Creado el evento "${event.title}" (publicado).`);
	return event;
}

runIfMain(import.meta.url, seedEvent);
