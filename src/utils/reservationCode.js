import { randomBytes } from 'crypto';

export function generateReservationCode() {
	return `TCK-${randomBytes(4).toString('hex').toUpperCase()}`;
}
