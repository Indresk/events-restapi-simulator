import express from 'express';

const router = express.Router();

router.get('/');

export default router;

// No permitir inscripciones si el evento no tiene cupo.
// No permitir inscripciones en eventos cancelados.
// No permitir inscripciones en eventos con fecha pasada.
// No permitir que un usuario edite eventos que no creó.
// No permitir que una contraseña recuperada sea igual a la anterior.
