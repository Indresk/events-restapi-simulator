// Crea el organizer de prueba
import { USER_ROLES } from '../constants/index.js';
import { SEED_ORGANIZER } from './seedData.js';
import { ensureUser, runIfMain } from './helpers.js';

export const seedOrganizer = () =>
	ensureUser({ ...SEED_ORGANIZER, role: USER_ROLES.ORGANIZER });

runIfMain(import.meta.url, seedOrganizer);
