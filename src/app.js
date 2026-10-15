import express from 'express';
import {
	errorHandler,
	notFoundHandler,
} from './middlewares/error.middleware.js';
import httpLogger from './middlewares/httpLogger.middleware.js';
import passport from 'passport';
import './config/passport.js';

import usersRouter from './routes/users.router.js';
import ticketsRouter from './routes/tickets.router.js';
import eventsRouter from './routes/events.router.js';
import sessionsRouter from './routes/sessions.router.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(httpLogger);

app.get('/api/health', (req, res) => {
	res
		.status(200)
		.json({ status: 'active', message: 'API corriendo correctamente.' });
});

app.use('/api/users', usersRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/sessions', sessionsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
