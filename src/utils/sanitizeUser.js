export function sanitizeUser(user) {
	if (!user) return user;

	const { password, ...safeUser } =
		typeof user.toObject === 'function' ? user.toObject() : user;

	return safeUser;
}
