import mongoose from 'mongoose';
import { USER_ROLES } from '../constants/index.js';

const userSchema = new mongoose.Schema(
	{
		first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: { type: String, required: true },
		role: {
			type: String,
			enum: Object.values(USER_ROLES),
			default: USER_ROLES.USER,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		toJSON: {
			transform(_doc, ret) {
				const { password, __v, ...rest } = ret;
				return rest;
			},
		},
		toObject: {
			transform(_doc, ret) {
				const { password, __v, ...rest } = ret;
				return rest;
			},
		},
	},
);

export default mongoose.model('User', userSchema);
