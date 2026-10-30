import nodemailer from 'nodemailer';
import config from './index.js';

export const transporter = nodemailer.createTransport({
	host: config.MAIL_HOST,
	port: Number(config.MAIL_PORT),
	auth: {
		user: config.MAIL_USER,
		pass: config.MAIL_PASS,
	},
});
