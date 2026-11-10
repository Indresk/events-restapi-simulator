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
- Nodemailer

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

### Variables de email (Nodemailer)

Las credenciales de correo se leen solo desde el `.env`, nunca están en el código. Todas son obligatorias:

| Variable    | Descripción                                |
| ----------- | ------------------------------------------ |
| `MAIL_HOST` | Host del servidor SMTP                     |
| `MAIL_PORT` | Puerto SMTP                                |
| `MAIL_USER` | Usuario de la cuenta SMTP                  |
| `MAIL_PASS` | Contraseña de la cuenta SMTP               |
| `MAIL_FROM` | Remitente que verá el usuario en el correo |

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

- **user:** asistente. Consulta eventos y se inscribe mediante tickets.
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

| Acción                                   | user |  organizer   | admin |
| ---------------------------------------- | :--: | :----------: | :---: |
| Consultar eventos no `draft`             |  ✅  |      ✅      |  ✅   |
| Consultar eventos `draft`                |  ❌  | solo propios |  ✅   |
| Crear eventos                            |  ❌  |      ✅      |  ✅   |
| Modificar/cambiar estado eventos propios |  ❌  |      ✅      |  ✅   |
| Modificar cualquier evento               |  ❌  |      ❌      |  ✅   |
| Inscribirse a un evento                  |  ✅  |      ✅      |  ✅   |
| Ver y cancelar sus propios tickets       |  ✅  |      ✅      |  ✅   |
| Ver tickets de un evento propio          |  ❌  |      ✅      |  ✅   |
| Ver tickets de cualquier evento          |  ❌  |      ❌      |  ✅   |
| Cancelar tickets ajenos                  |  ❌  |      ❌      |  ✅   |
| Ver todos los usuarios                   |  ❌  |      ❌      |  ✅   |
| Crear usuarios y cambiar roles           |  ❌  |      ❌      |  ✅   |

La matriz está definida en código en `src/constants/permissions.js`. Las rutas la consumen a través del middleware de autorización, así que ningún router escribe roles a mano:

```js
export const PERMISSIONS = {
	EVENTS_READ_PUBLISHED: [USER, ORGANIZER, ADMIN],
	EVENTS_CREATE: [ORGANIZER, ADMIN],
	EVENTS_UPDATE_OWN: [ORGANIZER, ADMIN],
	EVENTS_UPDATE_ANY: [ADMIN],
	EVENTS_READ_TICKETS: [ORGANIZER, ADMIN],
	TICKETS_MANAGE_ANY: [ADMIN],
	USERS_READ_ALL: [ADMIN],
	USERS_MANAGE: [ADMIN],
};
```

## Middlewares de autenticación y autorización

Los middlewares están separados del código de rutas y se reutilizan en todos los routers.

- **`authenticate`** (`src/middlewares/auth.middleware.js`): lee el JWT de la cookie `currentUser` con la estrategia `current` de Passport. Si es válido, carga el usuario desde la base y lo deja en `req.user`. Si no hay cookie, el token es inválido o expiró, o el usuario ya no existe o está inactivo, responde **401**.
- **`authorize(...roles)`** (`src/middlewares/authorize.middleware.js`): recibe los roles permitidos y los compara con `req.user.role`. Si el rol no está incluido, responde **403**.
- **`authorizeEventOwnerOrAdmin`** (`src/middlewares/authorize.middleware.js`): valida la propiedad del recurso. Un organizer solo pasa si es el `organizer` del evento (toma el id de `:eid` o `:id`). Un admin pasa siempre. En otro caso responde **403**.

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
GET    /api/events                  # público, con filtros, paginación y orden
GET    /api/events/:id              # público
POST   /api/events                  # organizer, admin
PUT    /api/events/:id              # organizer dueño, admin
PATCH  /api/events/:id/status       # organizer dueño, admin
```

```bash
# Users (rutas administrativas)
GET    /api/users                   # admin
GET    /api/users/:id               # admin
POST   /api/users                   # admin (puede indicar role)
PATCH  /api/users/:id               # admin (cambia el role)
```

```bash
# Tickets
POST   /api/events/:eid/tickets     # auth (inscripción)
GET    /api/events/:eid/tickets     # organizer dueño del evento, admin
GET    /api/tickets/my-tickets      # auth (solo los propios)
PATCH  /api/tickets/:tid/cancel     # dueño del ticket, admin
```

### Eventos

Modelo `Event`: `title`, `description`, `category`, `location` (obligatorios), `date`, `capacity` (entero > 0), `price` (≥ 0), `status` y `organizer` (referencia `ObjectId` al `User`, no un objeto embebido). Estados válidos: `draft` (por defecto), `published`, `cancelled`, `finished`.

Para crear un evento se debe apuntar al endpoint `POST /api/events` estando logueado como `organizer` o `admin`:

```json
{
	"title": "Workshop de folclor",
	"description": "Bailemos juntos",
	"category": "workshop",
	"location": "Irlanda",
	"date": "2027-01-01T20:00:00.000Z",
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
		"title": "Workshop de folclor",
		"organizer": "6ad0849f3f458ea59d3731c1",
		"status": "draft"
	},
	"message": "Evento creado con exito."
}
```

`organizer` siempre se toma de `req.user`; si llega en el body se ignora.

#### Listado con filtros

`GET /api/events` es público. Los eventos en `draft` solo los ven su organizer dueño y los admin; para el resto (sin sesión, `user` u otro organizer) no existen. La sesión es opcional en esta ruta.

| Query      | Descripción                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| `status`   | `draft`, `published`, `cancelled` o `finished`. Por defecto devuelve los eventos visibles para quien consulta |
| `category` | Coincidencia exacta                                                                                           |
| `location` | Coincidencia parcial, sin distinguir mayúsculas                                                               |
| `dateFrom` | Eventos con `date` mayor o igual                                                                              |
| `dateTo`   | Eventos con `date` menor o igual                                                                              |
| `page`     | Página, por defecto `1`                                                                                       |
| `limit`    | Elementos por página, por defecto `10`, máximo `50`                                                           |
| `sort`     | `date`, `price`, `title`, `capacity` o `createdAt`; con `-` delante es descendente. Por defecto `date`        |

Ejemplo: `GET /api/events?status=published&category=workshop&page=2&limit=5&sort=-date`

```json
{
	"status": "success",
	"data": [],
	"page": 2,
	"limit": 5,
	"total": 12,
	"totalPages": 3,
	"message": "Eventos obtenidos con exito."
}
```

Parámetros inválidos responden `400`. `GET /api/events/:id` devuelve `404` si el evento no existe o es un `draft` que quien consulta no puede ver.

#### Actualización y estados

- `PUT /api/events/:id` acepta cualquier combinación de `title`, `description`, `category`, `location`, `date`, `capacity` y `price`. `organizer` y `status` no se pueden modificar por esta ruta.
- `PATCH /api/events/:id/status` recibe `{ "status": "published" }` y aplica estas transiciones: `draft → published | cancelled`, `published → cancelled | finished`. Un evento `cancelled` o `finished` es inmodificable y responde `409`.
- Cancelar es solo cambiar el estado a `cancelled`, los eventos nunca se eliminan.

#### Reglas de negocio de eventos

Viven en `src/services/event.service.js`:

- La fecha del evento debe ser futura al crear o editarla.
- `capacity` debe ser entero mayor a 0 y `price` no puede ser negativo.
- No se puede publicar un evento con fecha pasada, cancelado ni finalizado.
- No se puede cancelar un evento cuya fecha ya pasó.
- La capacidad no puede reducirse por debajo de los cupos ya reservados.
- Un organizer solo modifica sus eventos; un admin modifica cualquiera (`403` en otro caso).
- Los eventos cancelados no se modifican (no se documentó ninguna excepción).

```json
{
	"status": "error",
	"error": "not_authorized",
	"message": "Solo el organizador del evento o un admin pueden realizar esta acción"
}
```

### Tickets e inscripciones

Modelo `Ticket`: `user` y `event` (referencias `ObjectId`), `status`, `quantity` (entero ≥ 1, por defecto 1), `reservationCode` (único, formato `TCK-XXXXXXXX`), `createdAt` y `cancelledAt`.

Estados: `confirmed` (por defecto al inscribirse), `pending` y `cancelled`. Los tickets nunca se eliminan.

#### Flujo de inscripción

`POST /api/events/:eid/tickets` con body opcional `{ "quantity": 2 }` (por defecto 1). El usuario sale de la sesión. Las validaciones se hacen en `src/services/ticket.service.js` en este orden:

1. Sesión válida (`401`).
2. `quantity` es un entero mayor a 0 (`400`).
3. El evento existe (`404`).
4. El evento no está `cancelled` ni `finished` y su fecha no pasó (`409`).
5. El evento está `published` (`409`).
6. El usuario no tiene ya un ticket activo para ese evento (`409`).
7. Hay cupo suficiente (`409`, el mensaje indica cupos disponibles y solicitados).

Si todo es válido se crea el ticket y se envía el email de confirmación. Si el envío falla, la inscripción sigue siendo válida y el error se registra en consola.

#### Regla de cupos

Cupos ocupados = suma de `quantity` de los tickets del evento con estado `confirmed` o `pending`. Los `cancelled` no cuentan, por eso al cancelar un ticket el cupo queda libre automáticamente sin tocar el evento. Disponible = `capacity` − ocupados.

#### Consultas y cancelación

- `GET /api/tickets/my-tickets` devuelve solo los tickets del usuario autenticado, con `event` poblado (`title`, `date`, `location`).
- `GET /api/events/:eid/tickets` lo ven el organizer dueño del evento o un admin (`403` en otro caso). Cada ticket incluye `first_name`, `last_name` y `email` del inscripto.
- `PATCH /api/tickets/:tid/cancel` lo puede ejecutar el dueño del ticket o un admin. Responde `404` si no existe, `403` si es ajeno, `409` si ya estaba cancelado o si el evento ya finalizó. Cambia `status` a `cancelled`, registra `cancelledAt` y envía un email de cancelación al dueño.

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
│   ├── config // Capa de configuración base y de librerias
│   ├── constants // Capa de constantes y enumeraciones
│   ├── controllers // Capa de controladores que solo se encargan de recibir la request y devolver la response
│   ├── dao // Capa de acceso a datos, que se encarga de la comunicación con la base de datos
│   ├── dto // Capa de objetos de transferencia de datos, que se encarga de validar y transformar los datos de entrada y salida
│   ├── errors // Capa de errores personalizados
│   ├── middlewares // Capa de middlewares que se encargan de la autenticación, autorización y validación de datos
│   ├── models // Capa de modelos de datos, que se encarga de definir los esquemas de la base de datos
│   ├── repositories // Capa que se encarga del desacoplamiento entre la capa de acceso a datos y la capa de servicios
│   ├── routes // Capa de rutas que se encargan de definir los endpoints y los controladores que los manejan
│   ├── scripts
│   ├── services // Capa de servicios que se encargan de la lógica de negocio
│   ├── utils // Utilidades que se encargan de funciones auxiliares
│   ├── app.js // Archivo principal de la aplicación que crea la instancia de express y configura los middlewares y rutas
│   └── server.js // Archivo que arranca el servidor y se conecta a la base de datos
├── .gitignore
├── .env.example
├── package.json
└── README.md
```
