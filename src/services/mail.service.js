import { transporter } from '../config/mailer.js';
import config from '../config/index.js';

class MailService {
	static async sendTicketConfirmation({
		to,
		userName,
		eventTitle,
		reservationCode,
	}) {
		await transporter.sendMail({
			from: config.MAIL_FROM,
			to,
			subject: 'Confirmación de inscripción',
			html: `
				<h1>Inscripción confirmada</h1>
				<p>Hola ${userName}, tu inscripción al evento ${eventTitle} fue confirmada.</p>
				<p>Código de reserva: <strong>${reservationCode}</strong></p>
			`,
		});
	}

	static async sendTicketCancellation({
		to,
		userName,
		eventTitle,
		reservationCode,
	}) {
		await transporter.sendMail({
			from: config.MAIL_FROM,
			to,
			subject: 'Cancelación de inscripción',
			html: `
				<h1>Inscripción cancelada</h1>
				<p>Hola ${userName}, tu inscripción al evento ${eventTitle} fue cancelada.</p>
				<p>Código de reserva: <strong>${reservationCode}</strong></p>
			`,
		});
	}
}

export default MailService;
