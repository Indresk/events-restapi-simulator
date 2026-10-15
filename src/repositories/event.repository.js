import Event from '../models/event.js';

class EventRepository {
	static async getAll() {
		const events = await Event.find();
		return events;
	}

	static async getById(id) {
		const event = await Event.findById(id);
		return event;
	}

	static async create({
		title,
		location,
		startDate,
		endDate,
		organizer,
		capacity,
		price,
	}) {
		const event = await Event.create({
			title,
			location,
			startDate,
			endDate,
			organizer,
			capacity,
			price,
		});

		return event;
	}

	static async updateStatus({ id, status }) {
		const eventUpdated = await Event.findByIdAndUpdate(
			id,
			{ status },
			{ returnDocument: 'after' },
		);
		return eventUpdated;
	}

	static async updateTikets({ id, ticketsSold }) {
		const eventUpdated = await Event.findByIdAndUpdate(
			id,
			{ ticketsSold },
			{ returnDocument: 'after' },
		);
		return eventUpdated;
	}

	static async insertMany(events) {
		const newEvents = await Event.insertMany(events);
		return newEvents;
	}
}

export default EventRepository;
