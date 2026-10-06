import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { createHash, isValidPassword } from '../utils/hash.js';
import ERROR_CODES from '../errors/error.codes.js';
import AppError from '../errors/app.error.js';
import { emailSchema, passwordSchema } from '../utils/zodSchemas.js';
import UserRepository from '../repositories/user.repository.js';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { cookieExtractor } from './cookies.js';
import config from './index.js';

passport.use(
	'register',
	new LocalStrategy(
		{
			usernameField: 'email',
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				const { first_name, last_name } = req.body;

				if (!first_name || !last_name || !email || !password) {
					throw new AppError(
						ERROR_CODES.BAD_REQUEST,
						'Faltan datos requeridos del usuario',
					);
				}

				const validatedEmailData = emailSchema.safeParse(email);

				if (!validatedEmailData.success) {
					throw new AppError(
						ERROR_CODES.BAD_REQUEST,
						`El email proporcionado no es válido`,
					);
				}

				const userStatus = await UserRepository.getByEmail(
					validatedEmailData.data,
				);

				const validatedPasswordData = passwordSchema.safeParse(password);

				if (userStatus) throw new AppError(ERROR_CODES.USER_ALREADY_EXISTS);

				if (!validatedPasswordData.success)
					throw new AppError(
						ERROR_CODES.BAD_REQUEST,
						`La contraseña proporcionada no cumple las caracteristicas necesarias.`,
					);

				const passwordHashed = await createHash(validatedPasswordData.data);

				const user = await UserRepository.create({
					first_name,
					last_name,
					email,
					password: passwordHashed,
				});

				const newUser = user.toObject();

				return done(null, newUser);
			} catch (error) {
				return done(error);
			}
		},
	),
);

passport.use(
	'login',
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		async (email, password, done) => {
			try {
				if (!email || !password) {
					throw new AppError(
						ERROR_CODES.BAD_REQUEST,
						'Faltan datos requeridos del usuario',
					);
				}

				const validatedData = emailSchema.safeParse(email);

				if (!validatedData.success) {
					throw new AppError(
						ERROR_CODES.BAD_REQUEST,
						`El email proporcionado no es válido`,
					);
				}

				const user = await UserRepository.getByEmail(validatedData.data);

				if (!user)
					throw new AppError(ERROR_CODES.BAD_REQUEST, `Credenciales invalidas`);

				const { password: hashedPassword } = user;

				if (!(await isValidPassword(password, hashedPassword)))
					throw new AppError(ERROR_CODES.BAD_REQUEST, `Credenciales invalidas`);

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		},
	),
);

passport.use(
	'current',
	new JwtStrategy(
		{
			jwtFromRequest: cookieExtractor,
			secretOrKey: config.JWT_SECRET,
		},
		async (jwtPayload, done) => {
			try {
				const userData = await UserRepository.getById(jwtPayload.id);
				if (!userData) throw new AppError(ERROR_CODES.USER_NOT_FOUND);
				const user = userData.toObject();

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		},
	),
);
