import mongoose from 'mongoose';
import AppError from '../errors/app.error.js';
import EventRepository from '../repositories/event.repository.js';
import TicketRepository from '../repositories/ticket.repository.js';
import ERROR_CODES from '../errors/error.codes.js';
import {
	eventCreateSchema,
	eventUpdateSchema,
	eventStatusSchema,
	eventQuerySchema,
} from '../utils/zodSchemas.js';
import { EVENT_STATUS, USER_ROLES } from '../constants/index.js';

const CLOSED_STATUSES = [EVENT_STATUS.CANCELLED, EVENT_STATUS.FINISHED];

const STATUS_TRANSITIONS = {
	[EVENT_STATUS.DRAFT]: [EVENT_STATUS.PUBLISHED, EVENT_STATUS.CANCELLED],
	[EVENT_STATUS.PUBLISHED]: [EVENT_STATUS.CANCELLED, EVENT_STATUS.FINISHED],
	[EVENT_STATUS.CANCELLED]: [],
	[EVENT_STATUS.FINISHED]: [],
};

function validateId(id) {
	if (!id)
		throw new AppError(ERROR_CODES.BAD_REQUEST, 'Falta el id del evento');

	if (!mongoose.isValidObjectId(id))
		throw new AppError(
			ERROR_CODES.BAD_REQUEST,
			`El id proporcionado no es válido`,
		);
}

function parseOrThrow(schema, data, message) {
	const validated = schema.safeParse(data ?? {});

	if (!validated.success)
		throw new AppError(
			ERROR_CODES.BAD_REQUEST,
			message,
			validated.error.issues,
		);

	return validated.data;
}

function visibilityFilter(user) {
	if (user?.role === USER_ROLES.ADMIN) return null;

	const published = { status: { $ne: EVENT_STATUS.DRAFT } };

	if (user?.role === USER_ROLES.ORGANIZER)
		return { $or: [published, { organizer: user._id }] };

	return published;
}

function escapeRegex(text) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class EventService {
	static async getAllVisible(query, user) {
		const { status, category, location, dateFrom, dateTo, page, limit, sort } =
			parseOrThrow(
				eventQuerySchema,
				query,
				'Los parámetros de búsqueda no son válidos',
			);

		const conditions = [];
		const visibility = visibilityFilter(user);

		if (visibility) conditions.push(visibility);
		if (status) conditions.push({ status });
		if (category) conditions.push({ category });
		if (location)
			conditions.push({
				location: { $regex: escapeRegex(location), $options: 'i' },
			});

		if (dateFrom || dateTo) {
			const date = {};
			if (dateFrom) date.$gte = dateFrom;
			if (dateTo) date.$lte = dateTo;
			conditions.push({ date });
		}

		const filter = conditions.length ? { $and: conditions } : {};

		const { events, total } = await EventRepository.getPaginated({
			filter,
			sort,
			skip: (page - 1) * limit,
			limit,
		});

		return {
			data: events,
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		};
	}

	static async getVisibleById(id, user) {
		validateId(id);

		const event = await EventRepository.getOne({
			$and: [{ _id: id }, visibilityFilter(user) ?? {}],
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

	static async create(data, organizer) {
		const validated = parseOrThrow(
			eventCreateSchema,
			data,
			'Los datos proporcionados para crear el evento no son válidos',
		);

		const event = await EventRepository.create({ ...validated, organizer });

		return event.toObject();
	}

	static async update(id, data) {
		const event = await this.getById(id);

		if (CLOSED_STATUSES.includes(event.status))
			throw new AppError(ERROR_CODES.EVENT_FULLFILLED);

		const validated = parseOrThrow(
			eventUpdateSchema,
			data,
			'Los datos proporcionados para actualizar el evento no son válidos',
		);

		const changes = Object.fromEntries(
			Object.entries(validated).filter(([, value]) => value !== undefined),
		);

		if (Object.keys(changes).length === 0)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'No se proporcionaron campos para actualizar',
			);

		if (changes.capacity !== undefined) {
			const reserved = await TicketRepository.countReservedSeats(event._id);

			if (changes.capacity < reserved)
				throw new AppError(
					ERROR_CODES.BAD_REQUEST,
					'La capacidad no puede ser menor a los cupos ya reservados',
				);
		}

		const updated = await EventRepository.update(id, changes);
		return updated.toObject();
	}

	static async updateStatus(id, status) {
		const event = await this.getById(id);

		const newStatus = parseOrThrow(
			eventStatusSchema,
			status,
			'El estado proporcionado no es válido',
		);

		if (CLOSED_STATUSES.includes(event.status))
			throw new AppError(ERROR_CODES.EVENT_FULLFILLED);

		if (!STATUS_TRANSITIONS[event.status].includes(newStatus))
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				`No se puede pasar un evento de ${event.status} a ${newStatus}`,
			);

		const isPast = event.date <= new Date();

		if (newStatus === EVENT_STATUS.PUBLISHED && isPast)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'No se puede publicar un evento con fecha pasada',
			);

		if (newStatus === EVENT_STATUS.CANCELLED && isPast)
			throw new AppError(ERROR_CODES.EVENT_FULLFILLED);

		const updated = await EventRepository.updateStatus({
			id,
			status: newStatus,
		});
		return updated.toObject();
	}
}

export default EventService;
