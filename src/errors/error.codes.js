const ERROR_CODES = {
	USER_NOT_FOUND: 'user_not_found',
	USER_ALREADY_EXISTS: 'user_already_exists',
	INVALID_USER_ROLE: 'invalid_user_role',
	INTERNAL_SERVER_ERROR: 'internal_server_error',
	CONFIG_ERROR: 'config_error',
	ROUTE_NOT_FOUND: 'route_not_found',
	BAD_REQUEST: 'bad_request',
	NOT_AUTHENTICATED: 'not_authenticated',
	NOT_AUTHORIZED: 'not_authorized',
	INVALID_TOKEN: 'invalid_token',
};

Object.freeze(ERROR_CODES);

export default ERROR_CODES;
