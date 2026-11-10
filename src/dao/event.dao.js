import Event from '../models/event.js';

class EventDAO {
	static async getPaginated({ filter, sort, skip, limit }) {
		const [events, total] = await Promise.all([
			Event.find(filter).sort(sort).skip(skip).limit(limit),
			Event.countDocuments(filter),
		]);
		return { events, total };
	}

	static async getById(id) {
		const event = await Event.findById(id);
		return event;
	}

	static async getOne(filter) {
		const event = await Event.findOne(filter);
		return event;
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
		const event = await Event.create({
			title,
			description,
			category,
			date,
			location,
			capacity,
			price,
			organizer,
		});

		return event;
	}

	static async update(id, data) {
		const eventUpdated = await Event.findByIdAndUpdate(id, data, {
			returnDocument: 'after',
			runValidators: true,
		});
		return eventUpdated;
	}

	static async updateStatus({ id, status }) {
		const eventUpdated = await Event.findByIdAndUpdate(
			id,
			{ status },
			{ returnDocument: 'after' },
		);
		return eventUpdated;
	}

	static async insertMany(events) {
		const newEvents = await Event.insertMany(events);
		return newEvents;
	}
}

export default EventDAO;
