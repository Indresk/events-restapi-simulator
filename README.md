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
