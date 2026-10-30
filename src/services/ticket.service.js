import mongoose from 'mongoose';
import AppError from '../errors/app.error.js';
import ERROR_CODES from '../errors/error.codes.js';
import EventService from './event.service.js';
import MailService from './mail.service.js';
import TicketRepository from '../repositories/ticket.repository.js';
import { generateReservationCode } from '../utils/reservationCode.js';
import { ticketQuantitySchema } from '../utils/zodSchemas.js';
import { PERMISSIONS } from '../constants/permissions.js';
import { EVENT_STATUS, TICKET_STATUS } from '../constants/index.js';

async function notify(sendMail) {
	try {
		await sendMail();
	} catch (error) {
		console.error('No se pudo enviar el email:', error.message);
	}
}

class TicketService {
	static async enroll({ eventId, user, quantity }) {
		const validatedQuantity = ticketQuantitySchema.safeParse(quantity);

		if (!validatedQuantity.success)
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'La cantidad debe ser un número entero mayor a 0',
				validatedQuantity.error.issues,
			);

		const event = await EventService.getById(eventId);

		if (
			event.status === EVENT_STATUS.CANCELLED ||
			event.status === EVENT_STATUS.FINISHED ||
			event.date <= new Date()
		)
			throw new AppError(ERROR_CODES.EVENT_FULLFILLED);

		if (event.status !== EVENT_STATUS.PUBLISHED)
			throw new AppError(ERROR_CODES.EVENT_NOT_AVAILABLE);

		const existing = await TicketRepository.getActiveByUserAndEvent({
			userId: user._id,
			eventId: event._id,
		});

		if (existing) throw new AppError(ERROR_CODES.TICKET_ALREADY_EXISTS);

		const reserved = await TicketRepository.countReservedSeats(event._id);
		const available = event.capacity - reserved;

		if (validatedQuantity.data > available)
			throw new AppError(
				ERROR_CODES.EVENT_NO_CAPACITY,
				`No hay cupos suficientes. Disponibles: ${available}, solicitados: ${validatedQuantity.data}`,
			);

		const ticket = await TicketRepository.create({
			user: user._id,
			event: event._id,
			quantity: validatedQuantity.data,
			reservationCode: generateReservationCode(),
		});

		await notify(() =>
			MailService.sendTicketConfirmation({
				to: user.email,
				userName: user.first_name,
				eventTitle: event.title,
				reservationCode: ticket.reservationCode,
			}),
		);

		return ticket.toObject();
	}

	static async getMyTickets(userId) {
		return TicketRepository.getByUser(userId);
	}

	static async getByEvent(eventId) {
		const event = await EventService.getById(eventId);
		return TicketRepository.getByEvent(event._id);
	}

	static async cancel({ ticketId, user }) {
		if (!mongoose.isValidObjectId(ticketId))
			throw new AppError(
				ERROR_CODES.BAD_REQUEST,
				'El id proporcionado no es válido',
			);

		const ticket = await TicketRepository.getById(ticketId);
		if (!ticket) throw new AppError(ERROR_CODES.NOT_FOUND);

		const isOwner = ticket.user.toString() === user._id.toString();
		const isAdmin = PERMISSIONS.TICKETS_MANAGE_ANY.includes(user.role);

		if (!isOwner && !isAdmin)
			throw new AppError(
				ERROR_CODES.NOT_AUTHORIZED,
				'Solo el dueño del ticket o un admin pueden cancelarlo',
			);

		if (ticket.status === TICKET_STATUS.CANCELLED)
			throw new AppError(ERROR_CODES.TICKET_ALREADY_CANCELLED);

		if (ticket.event.date <= new Date())
			throw new AppError(
				ERROR_CODES.EVENT_FULLFILLED,
				'No se puede cancelar una inscripción de un evento finalizado',
			);

		const cancelled = await TicketRepository.cancel(ticketId);

		if (isOwner)
			await notify(() =>
				MailService.sendTicketCancellation({
					to: user.email,
					userName: user.first_name,
					eventTitle: cancelled.event.title,
					reservationCode: cancelled.reservationCode,
				}),
			);

		return cancelled.toObject();
	}
}

export default TicketService;
