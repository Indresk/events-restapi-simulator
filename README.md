# API REST - Simulación de gestión de eventos musicales

Este proyecto es una REST API desarrollada en Node.js utilizando Express y MongoDB. Simula ser un API de gestion de eventos musicales.

## Tecnologías utilizadas

- Node.js
- Express
- Mongoose

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

_Nota: Dado que la API aún se encuentra en desarrollo las unicas rutas funcionales son las de USERS, el resto devuelven un objeto placeholder._

_Nota 2: Aún no está implementado el hasheo de la password para los users._
