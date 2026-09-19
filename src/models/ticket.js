import mongoose from 'mongoose';
import { TICKET_STATUS } from '../constants/index.js';

const ticketSchema = new mongoose.Schema(
	{
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event',
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(TICKET_STATUS),
			default: TICKET_STATUS.RESERVED,
		},
		purchaseDate: { type: Date, default: Date.now },
		paidAmount: { type: Number, required: true },
		metadata: mongoose.Schema.Types.Mixed, // Asiento o cualquier otra data
	},
	{ timestamps: true },
);

ticketSchema.index({ event: 1, user: 1 });
ticketSchema.index({ code: 1 });

export default mongoose.model('Ticket', ticketSchema);
