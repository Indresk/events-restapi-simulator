import express from 'express';
import TicketController from '../controllers/ticket.controller';

const router = express.Router();

router.get('/', TicketController.getAll);
router.get('/', TicketController.getById);
router.post('/', TicketController.create);

export default router;
