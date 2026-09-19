import express from 'express';
import EventController from '../controllers/event.controller.js';

const router = express.Router();

router.get('/', EventController.getAll);
router.get('/:id', EventController.getById);
router.post('/', EventController.create);

export default router;
