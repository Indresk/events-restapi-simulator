export default function successFormatter(payload, message) {
	const responseObject = { status: 'success' };
	if (payload != '') responseObject.payload = payload;
	if (message != '') responseObject.message = message;
	return responseObject;
}
