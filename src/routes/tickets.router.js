import express from 'express';
import TicketController from '../controllers/ticket.controller.js';

const router = express.Router();

router.get('/', TicketController.getAll);
router.get('/:id', TicketController.getById);
router.post('/', TicketController.create);

export default router;
