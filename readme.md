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
## Tickets e inscripciones

### Modelo Ticket
user (ref User), event (ref Event), status (pending | confirmed | cancelled),
quantity, reservationCode, createdAt, cancelledAt. Solo referencias, sin objetos embebidos.

### Endpoints
| Método | Ruta | Acceso |
|--------|------|--------|
| POST | /api/events/:eid/tickets | autenticado |
| GET | /api/tickets/my-tickets | autenticado (propios) |
| GET | /api/events/:eid/tickets | organizer (propios eventos) o admin |
| PATCH | /api/tickets/:tid/cancel | dueño del ticket o admin |

### Flujo de inscripción
Body: { "quantity": 2 } (opcional, por defecto 1). Se valida: evento existente, published,
no cancelado/finalizado, fecha futura, quantity > 0, cupos suficientes y sin inscripción activa duplicada.
Si todo es válido se crea el ticket confirmed y se envía un email de confirmación.

### Estados y cancelación
La cancelación es lógica: status = cancelled y se registra cancelledAt. Nunca se elimina el documento.
No se puede cancelar un ticket ajeno (salvo admin) ni uno ya cancelado.

### Regla de cupos
Cupos ocupados = suma de quantity de tickets pending o confirmed. Los cancelled no ocupan cupo.

### Variables de email
MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM (ver .env.example).

### Instalación y pruebas
npm install → copiar .env.example a .env → npm run dev. Probar con Postman o curl
usando cookies (-c cookies.txt -b cookies.txt) tras hacer login.