class TicketService {
	static async placeHolder(...props) {
		const payload = { data: 'data placeholder' };
		return payload;
	}
}

export default TicketService;

// notas:
// verificar que ticketsSold < capacity
// Solo el dueño del ticket o un admin puede cancelar/usar un ticket.
