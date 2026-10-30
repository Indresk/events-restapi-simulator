import mongoose from 'mongoose';
import { EVENT_STATUS } from '../constants/index.js';

const eventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true },
		category: { type: String, required: true, trim: true },
		date: { type: Date, required: true },
		location: { type: String, required: true, trim: true },
		capacity: { type: Number, required: true, min: 1 },
		price: { type: Number, required: true, min: 0, default: 0 },
		status: {
			type: String,
			enum: Object.values(EVENT_STATUS),
			default: EVENT_STATUS.DRAFT,
		},
		organizer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true },
);

eventSchema.index({ organizer: 1, date: -1 });
eventSchema.index({ status: 1, date: -1 });
eventSchema.index({ category: 1 });

export default mongoose.model('Event', eventSchema);
