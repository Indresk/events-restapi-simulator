import mongoose from 'mongoose';
import { TICKET_STATUS } from '../constants/index.js';

const ticketSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event',
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(TICKET_STATUS),
			default: TICKET_STATUS.CONFIRMED,
		},
		quantity: { type: Number, required: true, min: 1, default: 1 },
		reservationCode: { type: String, required: true, unique: true },
		cancelledAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

ticketSchema.index({ event: 1, status: 1 });
ticketSchema.index({ user: 1, event: 1 });

export default mongoose.model('Ticket', ticketSchema);
