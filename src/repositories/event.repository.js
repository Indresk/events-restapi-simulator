import EventDAO from '../dao/event.dao.js';

class EventRepository {
	static async getPaginated({ filter, sort, skip, limit }) {
		return await EventDAO.getPaginated({ filter, sort, skip, limit });
	}

	static async getById(id) {
		return await EventDAO.getById(id);
	}

	static async getOne(filter) {
		return await EventDAO.getOne(filter);
	}

	static async create({
		title,
		description,
		category,
		date,
		location,
		capacity,
		price,
		organizer,
	}) {
		return await EventDAO.create({
			title,
			description,
			category,
			date,
			location,
			capacity,
			price,
			organizer,
		});
	}

	static async update(id, data) {
		return await EventDAO.update(id, data);
	}

	static async updateStatus({ id, status }) {
		return await EventDAO.updateStatus({ id, status });
	}

	static async insertMany(events) {
		return await EventDAO.insertMany(events);
	}
}

export default EventRepository;
