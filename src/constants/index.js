export const ENVIRONMENT = {
	PROD: 'production',
	DEV: 'development',
};

export const USER_ROLES = {
	ADMIN: 'admin',
	ORGANIZER: 'organizer',
	USER: 'user',
};

export const EVENT_STATUS = {
	DRAFT: 'draft',
	PUBLISHED: 'published',
	CANCELLED: 'cancelled',
	COMPLETED: 'completed',
};

export const TICKET_STATUS = {
	RESERVED: 'reserved',
	PAID: 'paid',
	CANCELLED: 'cancelled',
	USED: 'used',
};

[(USER_ROLES, ENVIRONMENT, EVENT_STATUS, TICKET_STATUS)].forEach(Object.freeze);
