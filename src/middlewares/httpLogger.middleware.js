import { styleMethod, styleStatus } from '../utils/httpColorFunctions.js';

export default function httpLogger(req, res, next) {
	res.on('finish', () => {
		const method = styleMethod(req.method);
		const statusCode = styleStatus(res.statusCode);
		console.log(`${method} ${req.originalUrl} ${statusCode}`);
	});
	next();
}
