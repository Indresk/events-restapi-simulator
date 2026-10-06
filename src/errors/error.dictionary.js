import ERROR_CODES from './error.codes.js';

export const errorsDictionary = {
	[ERROR_CODES.USER_NOT_FOUND]: {
		statusCode: 404,
		message: 'No se encontró el usuario solicitado',
	},
	[ERROR_CODES.USER_ALREADY_EXISTS]: {
		statusCode: 409,
		message: 'El usuario ya existe',
	},
	[ERROR_CODES.INVALID_USER_ROLE]: {
		statusCode: 400,
		message: 'El rol de usuario no es válido',
	},

	[ERROR_CODES.INTERNAL_SERVER_ERROR]: {
		statusCode: 500,
		message: 'Error interno del servidor',
	},
	[ERROR_CODES.CONFIG_ERROR]: {
		statusCode: 500,
		message: 'Ocurrió un error de configuración',
	},
	[ERROR_CODES.ROUTE_NOT_FOUND]: {
		statusCode: 404,
		message: 'No se encontró la ruta solicitada',
	},
	[ERROR_CODES.BAD_REQUEST]: {
		statusCode: 400,
		message: 'No se proporcionaron los datos necesarios para esa solicitud',
	},
	[ERROR_CODES.NOT_AUTHENTICATED]: {
		statusCode: 403,
		message: 'Solicitud no autenticada',
	},
	[ERROR_CODES.NOT_AUTHORIZED]: {
		statusCode: 401,
		message: 'No dispones de la autorización necesaria para esa solicitud',
	},
	[ERROR_CODES.INVALID_TOKEN]: {
		statusCode: 401,
		message: 'Token invalido o expirado',
	},
};
