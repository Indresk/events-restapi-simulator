import TicketDAO from '../dao/ticket.dao.js';

class TicketRepository {
	static async getById(id) {
		return await TicketDAO.getById(id);
	}

	static async getByUser(userId) {
		return await TicketDAO.getByUser(userId);
	}

	static async getByEvent(eventId) {
		return await TicketDAO.getByEvent(eventId);
	}

	static async getActiveByUserAndEvent({ userId, eventId }) {
		return await TicketDAO.getActiveByUserAndEvent({ userId, eventId });
	}

	static async countReservedSeats(eventId) {
		return await TicketDAO.countReservedSeats(eventId);
	}

	static async create({ user, event, quantity, reservationCode }) {
		return await TicketDAO.create({ user, event, quantity, reservationCode });
	}

	static async cancel(id) {
		return await TicketDAO.cancel(id);
	}
}

export default TicketRepository;
