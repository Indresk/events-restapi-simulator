import { TicketResponseDTO } from '../dto/ticket.dto.js';
import TicketService from '../services/ticket.service.js';
import successFormatter from '../utils/successFormatter.js';

class TicketController {
	static async create(req, res, next) {
		try {
			const { eid } = req.params;
			const { quantity } = req.body ?? {};

			const payload = new TicketResponseDTO(
				await TicketService.enroll({
					eventId: eid,
					user: req.user,
					quantity,
				}),
			);

			res
				.status(201)
				.json(successFormatter(payload, 'Inscripción realizada con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async getMine(req, res, next) {
		try {
			const payload = (await TicketService.getMyTickets(req.user._id)).map(
				(ticket) => new TicketResponseDTO(ticket),
			);

			res
				.status(200)
				.json(successFormatter(payload, 'Tickets obtenidos con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async getByEvent(req, res, next) {
		try {
			const { eid } = req.params;
			const payload = (await TicketService.getByEvent(eid)).map(
				(ticket) => new TicketResponseDTO(ticket),
			);

			res
				.status(200)
				.json(successFormatter(payload, 'Tickets obtenidos con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async cancel(req, res, next) {
		try {
			const { tid } = req.params;
			const payload = new TicketResponseDTO(
				await TicketService.cancel({
					ticketId: tid,
					user: req.user,
				}),
			);

			res
				.status(200)
				.json(successFormatter(payload, 'Ticket cancelado con exito.'));
		} catch (error) {
			next(error);
		}
	}
}

export default TicketController;
