class SessionController {
	static logIn(req, res) {}

	static logOut(req, res) {
		req.clearCookie('session');
	}
}
