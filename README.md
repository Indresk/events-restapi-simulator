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

## Configuración de variables de entorno

Las variables de entorno necesarias se deben definir creando un archivo `.env` en la raíz del proyecto, debe seguir la estructura del archivo (`.env.example`)[./.env.example]. El proyecto está configurado para no arrancar si no encuentra las variables de entorno.

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

## Roles y permisos

Admin

- El administrador tendrá permisos generales sobre el sistema.
- Podrá gestionar usuarios, categorías, eventos e inscripciones.

Organizer

- El organizador será quien crea y administra eventos.
- Representa a una organización.

User

- El usuario común podrá consultar eventos y reservar tickets.
- Representa a un asistente.

## Estructura de carpetas

```bash
├── src
│   ├── config
│   ├── constants
│   ├── dao
│   ├── dto
│   ├── errors
│   ├── middlewares
│   ├── repositories
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── app.js
│   └── server.js
├── .gitignore
├── .env.example
├── package.json
└── README.md
```

## Rutas disponibles

Actualmente se encuentran disponibles las siguientes rutas:

```bash
# Endpoint de salud del servidor
GET /api/health
```

```bash
# USERS
GET /api/users
GET /api/users/:id
POST /api/users
PATCH /api/users/:id
```

```bash
# Tickets
GET /api/tickets
GET /api/tickets/:id
POST /api/tickets
```

```bash
# Events
GET /api/events
GET /api/events/:id
POST /api/events
```

```bash
# Sessions
POST /api/sessions/register
POST /api/sessions/login
POST /api/sessions/logout
GET /api/sessions/current
```

## Registro de usuarios

Se habilitó el endpoint `POST /api/sessions/register` para el registro de nuevos usuarios. A este endpoint se le debe enviar un objeto JSON con los siguientes campos:

```json
{
	"first_name": "jon",
	"last_name": "doe",
	"email": "jondoe@test.com",
	"password": "abcd.1234"
}
```

Los campos email y password se encuentran bajo validación realizada con zod, por lo que si no cumplen con los requisitos de validación el endpoint devolverá un error acorde.

Requisitos de email:

- Debe tener un formato de email válido, con @ y dominio.

_Nota: Zod realiza el retirado de espacios en blanco y ajusta todo el correo a lowercase antes de guardarlo en la base de datos._

Requisitos de password:

- Debe ser mayor a 8 caracteres.
- Debe ser menor a 20 caracteres.
- Debe tener al menos 8 caracteres.
- Debe contener al menos una letra mayúscula.
- Debe contener al menos una letra minúscula.
- Debe contener al menos un número.
- Debe contener al menos un carácter especial.

La contraseña se encuentra hasheada con bcrypt antes de ser almacenada en la base de datos, por lo que no se almacena en texto plano y esta configurada para no devolverse en las respuestas de POST o PATCH de la entidad `Users`.

## Sistema de login, logout y autorización con JWT

Se implementó un sistema de login y logout con JWT, el cual almacena de manera segura en cookies el token de acceso y permite el acceso a rutas protegidas.

Las rutas habilitadas en esta etapa fueron las siguientes con su respectivo input y output esperado:

### Ruta de login

```bash
POST /api/sessions/login
```

Descripción: Esta ruta permite a un usuario autenticarse en el sistema. Se le debe enviar un objeto JSON con los campos `email` y `password`. Si las credenciales son correctas, se generará un token JWT y se enviará en una cookie y un JSON de respuesta.

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

### Ruta de logout

```bash
POST /api/sessions/logout
```

Descripción: Esta ruta permite a un usuario cerrar sesión en el sistema. Se le debe enviar una request vacía y se eliminará la cookie con el token JWT.

Respuesta esperada:

```json
{
	"status": "success",
	"message": "Logout correcto"
}
```

### Ruta de sesión actual

```bash
GET /api/sessions/current
```

Descripción: Esta ruta es el ejemplo de ruta protegida y permite a un usuario obtener la información de su sesión actual. Se le debe enviar una request vacía y se devolverá un JSON con la información del usuario autenticado.

Respuesta esperada:

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

Respuesta de error esperada:

```json
{
	"status": "error",
	"error": "not_authenticated",
	"message": "Solicitud no autenticada"
}
```
