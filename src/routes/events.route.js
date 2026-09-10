import express from 'express';
import EventController from '../controllers/event.controller';

const router = express.Router();

router.get('/', EventController.getAll);
router.get('/', EventController.getById);
router.post('/', EventController.create);

export default router;
