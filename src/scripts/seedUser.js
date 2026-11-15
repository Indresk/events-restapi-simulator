// Crea el usuario de prueba (rol user)
import { USER_ROLES } from '../constants/index.js';
import { SEED_USER } from './seedData.js';
import { ensureUser, runIfMain } from './helpers.js';

export const seedUser = () => ensureUser({ ...SEED_USER, role: USER_ROLES.USER });

runIfMain(import.meta.url, seedUser);
