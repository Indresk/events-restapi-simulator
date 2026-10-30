import Ticket from '../models/ticket.js';
import { ACTIVE_TICKET_STATUSES, TICKET_STATUS } from '../constants/index.js';

class TicketRepository {
	static async getById(id) {
		const ticket = await Ticket.findById(id).populate(
			'event',
			'title date location',
		);
		return ticket;
	}

	static async getByUser(userId) {
		const tickets = await Ticket.find({ user: userId })
			.populate('event', 'title date location')
			.sort({ createdAt: -1 });
		return tickets;
	}

	static async getByEvent(eventId) {
		const tickets = await Ticket.find({ event: eventId })
			.populate('user', 'first_name last_name email')
			.sort({ createdAt: -1 });
		return tickets;
	}

	static async getActiveByUserAndEvent({ userId, eventId }) {
		const ticket = await Ticket.findOne({
			user: userId,
			event: eventId,
			status: { $in: ACTIVE_TICKET_STATUSES },
		});
		return ticket;
	}

	static async countReservedSeats(eventId) {
		const [result] = await Ticket.aggregate([
			{ $match: { event: eventId, status: { $in: ACTIVE_TICKET_STATUSES } } },
			{ $group: { _id: '$event', total: { $sum: '$quantity' } } },
		]);
		return result?.total ?? 0;
	}

	static async create({ user, event, quantity, reservationCode }) {
		const ticket = await Ticket.create({
			user,
			event,
			quantity,
			reservationCode,
		});
		return ticket;
	}

	static async cancel(id) {
		const ticket = await Ticket.findByIdAndUpdate(
			id,
			{ status: TICKET_STATUS.CANCELLED, cancelledAt: new Date() },
			{ returnDocument: 'after' },
		).populate('event', 'title date location');
		return ticket;
	}
}

export default TicketRepository;
