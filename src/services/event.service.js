import mongoose from 'mongoose';
import AppError from '../errors/app.error.js';
import EventRepository from '../repositories/event.repository.js';
import ERROR_CODES from '../errors/error.codes.js';
import { dateSchema, eventUpdateSchema } from '../utils/zodSchemas.js';
import { EVENT_STATUS } from '../constants/index.js';

const CLOSED_STATUSES = [EVENT_STATUS.CANCELLED, EVENT_STATUS.COMPLETED];

function validateId(id) {
	if (!id)
		throw new AppError(ERROR_CODES.BAD_REQUEST, 'Falta el id del evento');

	if (!mongoose.isValidObjectId(id))
		throw new AppError(
			ERROR_CODES.BAD_REQUEST,
			`El id proporcionado no es válido`,
		);
}

class EventService {
	static async getAllPublished() {
		const events = await EventRepository.getAll({
			status: EVENT_STATUS.PUBLISHED,
		});
		return events;
	}

	static async getPublishedById(id) {
		validateId(id);

		const event = await EventRepository.getOne({
			_id: id,
			status: EVENT_STATUS.PUBLISHED,
		});
		if (!event) throw new AppError(ERROR_CODES.NOT_FOUND);
		return event;
	}

	static async getById(id) {
		validateId(id);

		const event = await EventRepository.getById(id);
		if (!event) throw new AppError(ERROR_CODES.NOT_FOUND);
		return event;
	}

	static async create({
		title,
		description,
		location,
		startDate,
		endDate,
		organizer,
		capacity,
		price,
	}) {
		if (
			!title ||
			!location ||
			!startDate ||
			!endDate ||
			!organizer ||
			price === undefined ||
			price === null
		) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'Faltan datos requeridos del evento',
			);
		}

		if (price < 0) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'El precio no puede ser inferior a 0',
			);
		}

		const validatedStartDateData = dateSchema.safeParse(startDate);
		const validatedEndDateData = dateSchema.safeParse(endDate);

		if (!validatedStartDateData.success || !validatedEndDateData.success) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`La fecha proporcionada no es válida`,
			);
		}

		if (validatedEndDateData.data < validatedStartDateData.data) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'La fecha de fin no puede ser anterior a la de inicio',
			);
		}

		const event = await EventRepository.create({
			title,
			description,
			location,
			startDate: validatedStartDateData.data,
			endDate: validatedEndDateData.data,
			organizer,
			capacity,
			price,
		});

		return event.toObject();
	}

	static async update(id, data) {
		const event = await this.getById(id);

		if (CLOSED_STATUSES.includes(event.status))
			throw new AppError(ERROR_CODES.EVENT_FULLFILLED);

		const validated = eventUpdateSchema.safeParse(data ?? {});

		if (!validated.success)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'Los datos proporcionados para actualizar el evento no son válidos',
				validated.error.issues,
			);

		const changes = Object.fromEntries(
			Object.entries(validated.data).filter(([, value]) => value !== undefined),
		);

		if (Object.keys(changes).length === 0)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'No se proporcionaron campos para actualizar',
			);

		const startDate = changes.startDate ?? event.startDate;
		const endDate = changes.endDate ?? event.endDate;

		if (endDate < startDate)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'La fecha de fin no puede ser anterior a la de inicio',
			);

		if (
			changes.capacity !== undefined &&
			changes.capacity !== null &&
			changes.capacity < event.ticketsSold
		)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'La capacidad no puede ser menor a los tickets ya vendidos',
			);

		const updated = await EventRepository.update(id, changes);
		return updated.toObject();
	}

	static async cancel(id) {
		const event = await this.getById(id);

		if (CLOSED_STATUSES.includes(event.status))
			throw new AppError(ERROR_CODES.EVENT_FULLFILLED);

		const updated = await EventRepository.updateStatus({
			id,
			status: EVENT_STATUS.CANCELLED,
		});
		return updated.toObject();
	}

	// Para futura implementación- incrementa ticketsSold cuando un ticket pasa a paid
	static async addNewTickets({ id, ticketsSold }) {
		if (!id || !ticketsSold) {
			throw new AppError(ERROR_CODES.BAD_REQUEST, 'Faltan datos requeridos');
		}

		validateId(id);

		if (ticketsSold <= 0)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'La cantidad de tickets vendidos no pueden ser 0 o inferior',
			);

		const EventToUpdate = await this.getById(id);

		if (CLOSED_STATUSES.includes(EventToUpdate.status))
			throw new AppError(ERROR_CODES.EVENT_FULLFILLED);

		const validatedEndDateData = dateSchema.safeParse(EventToUpdate.endDate);

		if (!validatedEndDateData.success) {
			throw new AppError(ERROR_CODES.EVENT_FULLFILLED);
		}

		const newTicketsSold = EventToUpdate.ticketsSold + ticketsSold;

		if (
			EventToUpdate.capacity !== null &&
			newTicketsSold > EventToUpdate.capacity
		)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'La cantidad de tickets vendidos supera la capacidad del evento',
			);

		const event = await EventRepository.updateTikets({
			id,
			ticketsSold: newTicketsSold,
		});

		return event.toObject();
	}
}

export default EventService;

// Notas:
// Incrementar ticketsSold en Event cuando un ticket pase a paid
