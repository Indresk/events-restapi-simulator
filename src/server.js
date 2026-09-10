import http from 'http';
import app from './app.js';
import config from './config/index.js';
import connectDB from './config/db.js';

const server = http.createServer(app);

async function boot() {
	await connectDB();

	server.listen(config.PORT, () => {
		console.log(`Servidor iniciado en el puerto: ${config.PORT}`);
	});
}

boot();
