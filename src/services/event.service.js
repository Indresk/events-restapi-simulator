class EventService {
	static async placeHolder({ ...props }) {
		const payload = { data: 'data placeholder' };
		return payload;
	}
}

export default EventService;

// Notas:
// No permitir inscripciones si el evento no tiene cupo.
// No permitir inscripciones en eventos cancelados.
// No permitir inscripciones en eventos con fecha pasada.
// No permitir que un usuario edite eventos que no creó.
// No permitir que una contraseña recuperada sea igual a la anterior.
// Incrementar ticketsSold en Event cuando un ticket pase a paid
