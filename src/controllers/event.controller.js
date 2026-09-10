import EventService from '../services/event.service.js';
import successFormatter from '../utils/successFormatter.js';

class EventController {
	static async getAll(req, res, next) {
		try {
			const payload = await EventService.placeHolder();

			res.status(200).json(successFormatter(payload, 'obtenidos con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async getById(req, res, next) {
		try {
			const { id } = req.params;
			const payload = await EventService.placeHolder(id);

			res.status(200).json(successFormatter(payload, 'obtenido con exito.'));
		} catch (error) {
			next(error);
		}
	}

	static async create(req, res, next) {
		try {
			const { data } = req.body;

			const payload = await EventService.placeHolder({ data });

			res.status(201).json(successFormatter(payload, 'creado con exito.'));
		} catch (error) {
			next(error);
		}
	}
}

export default EventController;
