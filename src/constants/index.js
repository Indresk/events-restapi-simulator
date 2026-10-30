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
	FINISHED: 'finished',
};

export const TICKET_STATUS = {
	CONFIRMED: 'confirmed',
	PENDING: 'pending',
	CANCELLED: 'cancelled',
};

export const ACTIVE_TICKET_STATUSES = [
	TICKET_STATUS.CONFIRMED,
	TICKET_STATUS.PENDING,
];

[
	USER_ROLES,
	ENVIRONMENT,
	EVENT_STATUS,
	TICKET_STATUS,
	ACTIVE_TICKET_STATUSES,
].forEach(Object.freeze);
