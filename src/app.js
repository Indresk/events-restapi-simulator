import express from 'express';
import {
	errorHandler,
	notFoundHandler,
} from './middlewares/error.middleware.js';
import httpLogger from './middlewares/httpLogger.middleware.js';

import usersRouter from './routes/users.route.js';
import ticketsRouter from './routes/tickets.route.js';
import eventsRouter from './routes/events.route.js';
import sessionsRouter from './routes/sessions.route.js';

const app = express();

app.use(express.json());
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
