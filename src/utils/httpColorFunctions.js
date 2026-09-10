import { styleText } from 'node:util';

function statusColor(code) {
	if (code >= 200 && code < 300) return 'green';
	if (code >= 300 && code < 400) return 'cyan';
	if (code >= 400 && code < 500) return 'yellow';
	if (code >= 500) return 'red';
	return 'gray';
}

export function styleMethod(method) {
	const color = METHOD_COLORS[method] ?? 'gray';
	return styleText(color, method);
}

export function styleStatus(code) {
	const color = statusColor(code);
	return styleText(color, String(code));
}

const METHOD_COLORS = {
	GET: 'green',
	POST: 'blue',
	PUT: 'cyan',
	PATCH: 'yellow',
	DELETE: 'red',
};
