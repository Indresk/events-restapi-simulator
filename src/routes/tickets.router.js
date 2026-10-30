import express from 'express';
import TicketController from '../controllers/ticket.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/my-tickets', authenticate, TicketController.getMine);
router.patch('/:tid/cancel', authenticate, TicketController.cancel);

export default router;
