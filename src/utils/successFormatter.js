export default function successFormatter(payload, message) {
	const responseObject = { status: 'success' };
	if (payload !== '' && payload !== undefined) responseObject.payload = payload;
	if (message) responseObject.message = message;
	return responseObject;
}
