import { EventResponseDTO } from '../dto/event.dto.js';
import EventService from '../services/event.service.js';
import successFormatter from '../utils/successFormatter.js';

class EventController {
	static async getAll(req, res, next) {
		try {
			const { data, ...result } = await EventService.getAllVisible(
				req.query,
				req.user,
			);
			const eventsAdjusted = data.map((event) => new EventResponseDTO(event));

			res
				.status(200)
				.json(
					successFormatter(
						{ eventsAdjusted, ...result },
						'Eventos obtenidos con exito.',
					),
				);
		} catch (error) {
			next(error);
		}
	}

	static async getById(req, res, next) {
		try {
			const { id } = req.params;
			const payload = new EventResponseDTO(
				await EventService.getVisibleById(id, req.user),
			);

			res
				.status(200)
				.json(successFormatter(payload, 'Evento obtenido con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async create(req, res, next) {
		try {
			const payload = new EventResponseDTO(
				await EventService.create(req.body, req.user._id),
			);

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
			const payload = new EventResponseDTO(
				await EventService.update(id, req.body),
			);

			res
				.status(200)
				.json(successFormatter(payload, 'Evento actualizado con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async updateStatus(req, res, next) {
		try {
			const { id } = req.params;
			const { status } = req.body ?? {};
			const payload = new EventResponseDTO(
				await EventService.updateStatus(id, status),
			);

			res
				.status(200)
				.json(
					successFormatter(payload, 'Estado del evento actualizado con exito.'),
				);
		} catch (error) {
			next(error);
		}
	}
}

export default EventController;
