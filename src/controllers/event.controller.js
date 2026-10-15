import EventService from '../services/event.service.js';
import successFormatter from '../utils/successFormatter.js';

class EventController {
	static async getAll(req, res, next) {
		try {
			const payload = await EventService.getAllPublished();

			res
				.status(200)
				.json(successFormatter(payload, 'Eventos obtenidos con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async getById(req, res, next) {
		try {
			const { id } = req.params;
			const payload = await EventService.getPublishedById(id);

			res
				.status(200)
				.json(successFormatter(payload, 'Evento obtenido con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async create(req, res, next) {
		try {
			const {
				title,
				description,
				location,
				startDate,
				endDate,
				capacity = null,
				price,
			} = req.body;

			const payload = await EventService.create({
				title,
				description,
				location,
				startDate,
				endDate,
				organizer: req.user._id,
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

	static async update(req, res, next) {
		try {
			const { id } = req.params;
			const payload = await EventService.update(id, req.body);

			res
				.status(200)
				.json(successFormatter(payload, 'Evento actualizado con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async cancel(req, res, next) {
		try {
			const { id } = req.params;
			const payload = await EventService.cancel(id);

			res
				.status(200)
				.json(successFormatter(payload, 'Evento cancelado con exito.'));
		} catch (error) {
			next(error);
		}
	}
}

export default EventController;
