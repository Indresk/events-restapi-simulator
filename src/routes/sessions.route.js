import express from 'express';
import passport from 'passport';
import SessionController from '../controllers/session.controller.js';
const router = express.Router();

router.post(
	'/register',
	passport.authenticate('register', {
		session: false,
	}),
	SessionController.register,
);

router.post(
	'/login',
	passport.authenticate('login', {
		session: false,
	}),
	SessionController.logIn,
);

router.post('/logout', SessionController.logOut);

router.get(
	'/current',
	passport.authenticate('current', {
		session: false,
	}),
	SessionController.current,
);

export default router;
