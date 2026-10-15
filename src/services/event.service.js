import mongoose from 'mongoose';
import AppError from '../errors/app.error.js';
import EventRepository from '../repositories/event.repository.js';
import ERROR_CODES from '../errors/error.codes.js';
import { dateSchema } from '../utils/zodSchemas.js';
import UserService from './user.service.js';
import { EVENT_STATUS, USER_ROLES } from '../constants/index.js';

class EventService {
	static async getAll() {
		const events = await EventRepository.getAll();
		return events;
	}

	static async getById(id) {
		if (!id)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'Falta id del usuario a buscar',
			);

		if (!mongoose.isValidObjectId(id)) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`El id proporcionado no es válido`,
			);
		}

		const event = await EventRepository.getById(id);
		if (!event) throw new AppError(ERROR_CODES.NOT_FOUND);
		return event;
	}

	static async create({
		title,
		location,
		startDate,
		endDate,
		organizer,
		capacity,
		price,
	}) {
		if (!title || !location || !startDate || !endDate || !organizer || !price) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'Faltan datos requeridos del usuario',
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

		if (!validatedStartDateData.success && !validatedEndDateData.success) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`La fecha proporcionada no es válida`,
			);
		}

		const organizerData = await UserService.getById(organizer);

		if (![USER_ROLES.ADMIN, USER_ROLES.ORGANIZER].includes(organizerData.role))
			throw new AppError(
				ERROR_CODES.NOT_AUTHORIZED,
				'El usuario pasado como organizador no posee los permisos necesarios para crear un evento',
			);

		const event = await EventRepository.create({
			title,
			location,
			startDate,
			endDate,
			organizer,
			capacity,
			price,
		});

		return event.toObject();
	}

	static async updateStatus({ id, status }) {
		if (!id || !status) {
			throw new AppError(ERROR_CODES.BAD_REQUEST, 'Faltan datos requeridos');
		}

		if (!mongoose.isValidObjectId(id)) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`El id proporcionado no es válido`,
			);
		}

		if (!Object.values(EVENT_STATUS).includes(status))
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'Estatus proporcionado invalido para actualizar',
			);

		const event = await EventRepository.updateStatus({
			id,
			status,
		});

		return event.toObject();
	}

	static async addNewTickets({ id, ticketsSold }) {
		if (!id || !ticketsSold) {
			throw new AppError(ERROR_CODES.BAD_REQUEST, 'Faltan datos requeridos');
		}

		if (!mongoose.isValidObjectId(id)) {
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`El id proporcionado no es válido`,
			);
		}

		if (ticketsSold <= 0)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'La cantidad de tickets vendidos no pueden ser 0 o inferior',
			);

		const EventToUpdate = await this.getById(id);

		if (
			EventToUpdate.status === EVENT_STATUS.CANCELLED ||
			EventToUpdate.status === EVENT_STATUS.COMPLETED
		)
			throw new AppError(ERROR_CODES.EVENT_FULLFILLED);

		const validatedEndDateData = dateSchema.safeParse(EventToUpdate.endDate);

		if (!validatedEndDateData.success) {
			throw new AppError(ERROR_CODES.EVENT_FULLFILLED);
		}

		const newTicketsSold = EventToUpdate.ticketsSold + ticketsSold;

		if (!(EventToUpdate.capacity === null)) {
			if (EventToUpdate.capacity <= newTicketsSold)
				throw new AppError(
					ERROR_CODES.BAD_REQUEST,
					'La cantidad de tickets vendidos supera la capacidad del evento',
				);
		}

		const event = await EventRepository.updateStatus({
			id,
			newTicketsSold,
		});

		return event.toObject();
	}
}

export default EventService;

// Notas:
// No permitir que un usuario edite eventos que no creó.
// Incrementar ticketsSold en Event cuando un ticket pase a paid
