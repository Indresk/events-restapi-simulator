# API REST - Simulación de gestión de eventos musicales

Este proyecto es una REST API desarrollada en Node.js utilizando Express y MongoDB. Simula ser un API de gestion de eventos musicales.

## Tecnologías utilizadas

- Node.js
- Express
- Mongoose
- Zod
- Bcrypt
- JsonWebToken
- Dotenv
- Cookie-Parser

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Navegar al directorio del proyecto:
   ```bash
   cd <NOMBRE_DEL_PROYECTO>
   ```
3. Instalar las dependencias:
   ```bash
   npm install
   ```
4. Crear el `.env` a partir de `.env.example` y crear el primer admin:
   ```bash
   npm run seed:admin
   ```

## Configuración de variables de entorno

Las variables de entorno necesarias se deben definir creando un archivo `.env` en la raíz del proyecto, debe seguir la estructura del archivo [`.env.example`](./.env.example). El proyecto está configurado para no arrancar si no encuentra las variables de entorno.

## Como ejecutar el servidor

El servidor se puede ejecutar usando los comandos declarados en el `package.json`:

- Para ejecutar el servidor en modo desarrollo:
  ```bash
  npm run dev
  ```
- Para ejecutar el servidor en modo producción:
  ```bash
  npm start
  ```

_Nota: Para ejectar el servidor correctamente las variables de entorno deben estar correctamente configuradas y definidas. Tambien se debe asegurar de que todas las dependencias estén instaladas._

_Nota 2: El uso de los comandos `npm start` o `npm run dev` para inciar el servidor solo difiere en el estado watch de Node.js, con `npm start` este modo esta deshabilitado._

## Roles

El modelo `User` tiene el campo `role` con los valores `user`, `organizer` y `admin`. El valor por defecto es `user`.

- **user:** asistente. Consulta eventos publicados y reserva tickets.
- **organizer:** crea eventos y administra solo los suyos.
- **admin:** permisos generales. Gestiona usuarios y puede modificar cualquier evento.

El registro público (`POST /api/sessions/register`) siempre crea usuarios con rol `user`. Si el body incluye `role`, se ignora. Los roles `organizer` y `admin` solo los asigna un admin desde las rutas de usuarios.

### Primer admin

Como nadie puede registrarse como admin, el primero se crea con un script. Usa las variables `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FIRST_NAME` y `ADMIN_LAST_NAME` del `.env`:

```bash
npm run seed:admin
```

Si el email ya existe, el script promueve ese usuario a admin.

## Matriz de permisos

| Acción                             | user | organizer | admin |
| ---------------------------------- | :--: | :-------: | :---: |
| Consultar eventos publicados       |  ✅  |    ✅     |  ✅   |
| Crear eventos                      |  ❌  |    ✅     |  ✅   |
| Modificar/cancelar eventos propios |  ❌  |    ✅     |  ✅   |
| Modificar cualquier evento         |  ❌  |    ❌     |  ✅   |
| Ver todos los usuarios             |  ❌  |    ❌     |  ✅   |
| Crear usuarios y cambiar roles     |  ❌  |    ❌     |  ✅   |

La matriz está definida en código en `src/constants/permissions.js`. Las rutas la consumen a través del middleware de autorización, así que ningún router escribe roles a mano:

```js
export const PERMISSIONS = {
	EVENTS_READ_PUBLISHED: [USER, ORGANIZER, ADMIN],
	EVENTS_CREATE: [ORGANIZER, ADMIN],
	EVENTS_UPDATE_OWN: [ORGANIZER, ADMIN],
	EVENTS_UPDATE_ANY: [ADMIN],
	USERS_READ_ALL: [ADMIN],
	USERS_MANAGE: [ADMIN],
};
```

## Middlewares de autenticación y autorización

Los middlewares están separados del código de rutas y se reutilizan en todos los routers.

- **`authenticate`** (`src/middlewares/auth.middleware.js`): lee el JWT de la cookie `currentUser` con la estrategia `current` de Passport. Si es válido, carga el usuario desde la base y lo deja en `req.user`. Si no hay cookie, el token es inválido o expiró, o el usuario ya no existe o está inactivo, responde **401**.
- **`authorize(...roles)`** (`src/middlewares/authorize.middleware.js`): recibe los roles permitidos y los compara con `req.user.role`. Si el rol no está incluido, responde **403**.
- **`authorizeEventOwnerOrAdmin`** (`src/middlewares/authorize.middleware.js`): valida la propiedad del recurso. Un organizer solo pasa si es el `organizer` del evento. Un admin pasa siempre. En otro caso responde **403**.

El rol se lee de la base en cada request, no del token. Un cambio de rol aplica de inmediato, sin volver a hacer login.

Uso en una ruta:

```js
router.post(
	'/',
	authenticate, // 401 si no hay sesión
	authorize(...PERMISSIONS.EVENTS_CREATE), // 403 si el rol no tiene permiso
	EventController.create,
);
```

## Rutas disponibles

Acceso: **público** no requiere sesión. **auth** requiere cualquier sesión válida. El resto indica los roles permitidos.

```bash
# Salud del servidor
GET    /api/health                  # público
```

```bash
# Sessions
POST   /api/sessions/register       # público (siempre crea rol user)
POST   /api/sessions/login          # público
POST   /api/sessions/logout         # público
GET    /api/sessions/current        # auth
```

```bash
# Events
GET    /api/events                  # público, solo eventos published
GET    /api/events/:id              # público, solo eventos published
POST   /api/events                  # organizer, admin
PATCH  /api/events/:id              # organizer dueño, admin
PATCH  /api/events/:id/cancel       # organizer dueño, admin
```

```bash
# Users (rutas administrativas)
GET    /api/users                   # admin
GET    /api/users/:id               # admin
POST   /api/users                   # admin (puede indicar role)
PATCH  /api/users/:id               # admin (cambia el role)
```

```bash
# Tickets (placeholder, sin lógica aún)
GET    /api/tickets
GET    /api/tickets/:id
POST   /api/tickets
```

### Eventos

Para crear un nuevo evento se debe apuntar al endpoint `POST /api/events` y enviar en el body la siguiente estructura estando ya logeado desde la ruta `POST /api/sessions/login`:

```json
{
	"title": "Concierto de folclor",
	"description": "Bailemos juntos",
	"location": "Irlanda",
	"startDate": "2027-01-01T20:00:00.000Z",
	"endDate": "2027-01-02T02:00:00.000Z",
	"capacity": 500,
	"price": 100
}
```

Respuesta esperada `201`:

```json
{
	"status": "success",
	"payload": {
		"_id": "6ad0849f3f458ea59d3731c3",
		"title": "Concierto de folclor",
		"organizer": "6ad0849f3f458ea59d3731c1",
		"status": "draft",
		"ticketsSold": 0
	},
	"message": "Evento creado con exito."
}
```

_Nota: Se pueden editar los eventos desde el endpoint `PATCH /api/events/:id` acepta cualquier combinación de `title`, `description`, `location`, `startDate`, `endDate`, `capacity`, `price` y `status`. Para publicar un evento se envía `{ "status": "published" }`. Los campos `organizer` y `ticketsSold` no se pueden editar._

_Nota 2: `PATCH /api/events/:id/cancel` pasa el evento a `cancelled`. Un evento cancelado o completado ya no se puede modificar y responde `409`._

Si un organizer intenta modificar o cancelar un evento de otro organizer, recibe `403`:

```json
{
	"status": "error",
	"error": "not_authorized",
	"message": "Solo el organizador del evento o un admin pueden modificarlo"
}
```

## Registro de usuarios

El endpoint `POST /api/sessions/register` registra nuevos usuarios con rol `user`. Recibe un JSON con estos campos:

```json
{
	"first_name": "jon",
	"last_name": "doe",
	"email": "jondoe@test.com",
	"password": "Abcd.1234"
}
```

Los campos email y password se validan con zod. Si no cumplen los requisitos, el endpoint devuelve un error `400`.

Requisitos de email:

- Debe tener un formato de email válido, con @ y dominio.

_Nota: Zod quita los espacios en blanco y pasa el correo a minúsculas antes de guardarlo en la base de datos._

Requisitos de password:

- Debe tener entre 8 y 20 caracteres.
- Debe contener al menos una letra mayúscula.
- Debe contener al menos una letra minúscula.
- Debe contener al menos un número.
- Debe contener al menos un carácter especial.

La contraseña se hashea con bcrypt antes de guardarse, por lo que nunca se almacena en texto plano.

## Login, logout y sesión con JWT

El login genera un JWT y lo guarda en la cookie `httpOnly` `currentUser`. Las rutas protegidas leen el token desde esa cookie.

### Login

```bash
POST /api/sessions/login
```

Body esperado:

```json
{
	"email": "test@test.com",
	"password": "abcd.efG23"
}
```

Respuesta esperada:

```json
{
	"status": "success",
	"payload": {
		"id": "6ab847dd1d5590dc49e2db59",
		"first_name": "jon",
		"last_name": "doe",
		"email": "test@test.com",
		"role": "user"
	},
	"message": "Login exitoso"
}
```

Respuesta de error esperada:

```json
{
	"status": "error",
	"error": "bad_request",
	"message": "Credenciales invalidas"
}
```

### Logout

```bash
POST /api/sessions/logout
```

Elimina la cookie con el token JWT.

```json
{
	"status": "success",
	"message": "Logout correcto"
}
```

### Sesión actual

```bash
GET /api/sessions/current
```

Requiere sesión. Devuelve los datos del usuario autenticado:

```json
{
	"status": "success",
	"payload": {
		"id": "6ab847dd1d5590dc49e2db59",
		"email": "test@test.com",
		"role": "user"
	},
	"message": "Información de sesión obtenida correctamente."
}
```

Sin sesión responde `401` con `not_authenticated`. Con un token inválido o expirado responde `401` con `invalid_token`.

## Passport.js

Las estrategias están configuradas en `src/config/passport.js`:

```js
'register' - passport-local. Registra un nuevo usuario con rol user.
'login'    - passport-local. Autentica con email y password.
'current'  - passport-jwt. Valida el JWT de la cookie y carga el usuario.
```

La estrategia `current` no se usa directamente en las rutas. Se usa a través del middleware `authenticate`, que convierte cualquier fallo en una respuesta JSON `401`.

## Estructura de carpetas

```bash
├── src
│   ├── config
│   ├── constants
│   ├── controllers
│   ├── dao
│   ├── dto
│   ├── errors
│   ├── middlewares
│   ├── models
│   ├── repositories
│   ├── routes
│   ├── scripts
│   ├── services
│   ├── utils
│   ├── app.js
│   └── server.js
├── .gitignore
├── .env.example
├── package.json
└── README.md
```
