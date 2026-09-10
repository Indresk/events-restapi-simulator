import mongoose from 'mongoose';
import { EVENT_STATUS } from '../constants/index.js';

const eventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: String,
		location: { type: String, required: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		organizer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(EVENT_STATUS),
			default: EVENT_STATUS.DRAFT,
		},
		capacity: { type: Number, default: null }, // null = ilimitado
		ticketsSold: { type: Number, default: 0 },
		price: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

eventSchema.index({ organizer: 1, startDate: -1 });
eventSchema.index({ status: 1, startDate: -1 });

export default mongoose.model('Event', eventSchema);
