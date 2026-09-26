import * as z from 'zod';

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
