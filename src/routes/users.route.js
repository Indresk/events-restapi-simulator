import express from 'express';
import UserController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', UserController.getAll);
router.get('/', UserController.getById);
router.post('/', UserController.create);

export default router;
