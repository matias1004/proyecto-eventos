# Proyecto Eventos

Base arquitectónica de una API REST para una *Plataforma de Eventos e Inscripciones*, desarrollada en el curso Backend II.

## Temática

Plataforma de eventos e inscripciones: registro/login con JWT y cookies, autenticación con Passport.js, roles de usuario y, en próximas entregas, gestión de eventos, inscripciones, control de cupos y notificaciones.

## Tecnologías

- Node.js (módulos ES / import-export)
- Express
- MongoDB + Mongoose
- Passport.js (estrategias local y JWT)
- bcrypt, jsonwebtoken, cookie-parser, dotenv

## Instalación

\\\`bash
git clone https://github.com/matias1004/proyecto-eventos.git
cd proyecto-eventos
npm install
\\\`

## Configuración de variables de entorno

\\\`bash
cp .env.example .env
\\\`

| Variable   | Descripción                                    |
|------------|--------------------------------------------------|
| PORT       | Puerto donde corre el servidor (ej. 8080)        |
| NODE_ENV   | Entorno de ejecución (development/production)    |
| MONGO_URL  | Cadena de conexión a MongoDB                     |
| JWT_SECRET | Secreto para firmar los tokens JWT               |

## Cómo ejecutar

\\\`bash
npm start
\\\`

## Estructura de carpetas

\\\`
proyecto-eventos/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── dao/
│   ├── models/
│   ├── middlewares/
│   └── utils/
├── .env.example
├── .gitignore
├── package.json
└── README.md
\\\`

## Rutas disponibles

| Método | Ruta | Descripción | Respuesta |
|--------|------|--------------|-----------|
| GET | /api/health | Servidor activo | { "status": "ok", "message": "Servidor activo" } |
| POST | /api/sessions/register | Registro de usuario | 201 con el usuario creado |
| POST | /api/sessions/login | Login (setea cookie con JWT) | 200 con los datos del usuario |
| GET | /api/sessions/current | Usuario autenticado actual (requiere cookie válida) | 200 con el usuario |
| POST | /api/sessions/logout | Cierra sesión | 200 |