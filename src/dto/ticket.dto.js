export class TicketResponseDTO {
	constructor(ticket) {
		this.id = ticket._id;
		this.user = ticket.user;
		this.event = ticket.event;
		this.status = ticket.status;
		this.quantity = ticket.quantity;
		this.createdAt = ticket.createdAt;
	}
}
