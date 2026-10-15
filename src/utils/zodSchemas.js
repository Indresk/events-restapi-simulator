import * as z from 'zod';
import { EVENT_STATUS } from '../constants/index.js';

export const emailSchema = z.email().trim().toLowerCase();
export const passwordSchema = z
	.string()
	.trim()
	.min(8)
	.max(20)
	.refine((val) => /[A-Z]/.test(val))
	.refine((val) => /[a-z]/.test(val))
	.refine((val) => /[0-9]/.test(val))
	.refine((val) => /[^A-Za-z0-9]/.test(val));
// La fecha mínima se evalúa en cada validación, no al iniciar el servidor.
export const dateSchema = z.coerce
	.date()
	.refine((date) => date > new Date(), 'La fecha debe ser futura');

// Campos editables de un evento. organizer y ticketsSold no son editables
// y se descartan si llegan en el body.
export const eventUpdateSchema = z.object({
	title: z.string().trim().min(1).optional(),
	description: z.string().trim().optional(),
	location: z.string().trim().min(1).optional(),
	startDate: dateSchema.optional(),
	endDate: dateSchema.optional(),
	capacity: z.number().int().positive().nullable().optional(),
	price: z.number().min(0).optional(),
	status: z.enum(Object.values(EVENT_STATUS)).optional(),
});
