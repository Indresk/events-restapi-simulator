import EventService from '../services/event.service.js';
import successFormatter from '../utils/successFormatter.js';

class EventController {
	static async getAll(req, res, next) {
		try {
			const payload = await EventService.getAll();

			res.status(200).json(successFormatter(payload, 'obtenidos con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async getById(req, res, next) {
		try {
			const { id } = req.params;
			const payload = await EventService.getById(id);

			res.status(200).json(successFormatter(payload, 'obtenido con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async create(req, res, next) {
		try {
			const {
				title,
				location,
				startDate,
				endDate,
				organizer,
				capacity = null,
				price,
			} = req.body;

			const payload = await EventService.create({
				title,
				location,
				startDate,
				endDate,
				organizer,
				capacity,
				price,
			});

			res
				.status(201)
				.json(successFormatter(payload, 'Evento creado con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async updateStatus(req, res, next) {
		try {
			const { id } = req.params;
			const { status } = req.body;
			const payload = await EventService.updateStatus({ id, status });

			res
				.status(200)
				.json(successFormatter(payload, 'Status actualizado con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async addNewTickets(req, res, next) {
		try {
			const { id } = req.params;
			const { ticketsSold } = req.body;
			const payload = await EventService.addNewTickets({ id, ticketsSold });

			res
				.status(200)
				.json(successFormatter(payload, 'Tickets actualizados con exito.'));
		} catch (error) {
			next(error);
		}
	}
}

export default EventController;
