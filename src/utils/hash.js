import bcrypt from 'bcrypt';

export async function createHash(pass) {
	return await bcrypt.hash(pass, 10);
}

export async function isValidPassword(pass, hash) {
	return await bcrypt.compare(pass, hash);
}
