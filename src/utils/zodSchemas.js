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

const requiredText = z.string().trim().min(1);

export const eventCreateSchema = z.object({
	title: requiredText,
	description: requiredText,
	category: requiredText,
	date: dateSchema,
	location: requiredText,
	capacity: z.number().int().positive(),
	price: z.number().min(0),
});

// organizer y status no son editables por esta vía y se descartan si llegan en el body.
export const eventUpdateSchema = eventCreateSchema.partial();

export const eventStatusSchema = z.enum(Object.values(EVENT_STATUS));

const SORT_FIELDS = ['date', 'price', 'title', 'capacity', 'createdAt'];
const MAX_LIMIT = 50;

export const eventQuerySchema = z.object({
	status: eventStatusSchema.optional(),
	category: z.string().trim().min(1).optional(),
	location: z.string().trim().min(1).optional(),
	dateFrom: z.coerce.date().optional(),
	dateTo: z.coerce.date().optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce
		.number()
		.int()
		.min(1)
		.default(10)
		.transform((n) => Math.min(n, MAX_LIMIT)),
	sort: z
		.enum([...SORT_FIELDS, ...SORT_FIELDS.map((f) => `-${f}`)])
		.default('date'),
});

export const ticketQuantitySchema = z.number().int().positive().default(1);
