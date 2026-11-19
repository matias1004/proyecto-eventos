# Plataforma de Eventos e Inscripciones — API Backend

API REST para gestionar eventos e inscripciones con autenticación, roles, control de cupos y notificaciones por email. Entrega final del curso *Backend II*, construida como evolución de las pre-entregas anteriores.

## Temática

Los *organizadores* publican eventos, los *usuarios* se inscriben (con control de cupos y sin inscripciones duplicadas) y reciben un email de confirmación, y los *administradores* pueden gestionar cualquier evento o inscripción.

## Tecnologías

- Node.js (módulos ES) + Express
- MongoDB + Mongoose
- Passport.js (estrategias register, login y current)
- JWT guardado en cookie httpOnly + bcrypt para hashear contraseñas
- Nodemailer para las notificaciones por email
- dotenv y cookie-parser

## Instalación

bash
git clone https://github.com/matias1004/proyecto-eventos.git
cd proyecto-eventos
npm install
cp .env.example .env


> En Windows CMD usá copy .env.example .env. Después completá los valores del .env.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| PORT | Puerto del servidor (ej. 8080) |
| NODE_ENV | development o production (en production la cookie se marca secure) |
| MONGO_URL | Cadena de conexión a MongoDB (local o Atlas) |
| JWT_SECRET | Secreto para firmar los JWT |
| JWT_EXPIRES_IN | Duración del token (ej. 24h) |
| MAIL_HOST | Servidor SMTP (ej. smtp.gmail.com) |
| MAIL_PORT | Puerto SMTP (ej. 587) |
| MAIL_USER | Usuario SMTP |
| MAIL_PASS | Contraseña SMTP (en Gmail, una contraseña de aplicación) |
| MAIL_FROM | Remitente de los emails |

Si las variables MAIL_* están vacías, la API funciona igual: la inscripción se crea y solo se omite el email (queda un aviso en consola).

## Comandos

bash
npm start       # inicia el servidor
npm run dev     # inicia con reinicio automático (node --watch)
npm run seed    # crea los usuarios de prueba


## Arquitectura en capas


src/
├── routes/         # URLs y middlewares de cada recurso
├── controllers/    # coordinan request/response, sin lógica de negocio
├── services/       # lógica de negocio: cupos, estados, duplicados, permisos, email
├── repositories/   # capa intermedia: usan el DAO y devuelven DTOs
├── dao/            # único lugar que importa los modelos de Mongoose
├── dto/            # define qué datos salen en cada respuesta (nunca password)
├── models/         # schemas de Mongoose (User, Event, Ticket)
├── middlewares/    # auth (401), authorize (403) y manejo de errores
├── utils/          # hash, JWT, mailer, código de reserva
└── config/         # conexión a MongoDB y estrategias de Passport


Flujo de una request: routes → controllers → services → repositories → dao → models.

Reglas de la arquitectura:

- Los modelos de Mongoose *solo se importan en los DAO*.
- Los services consumen repositories (nunca DAO ni modelos).
- Los controllers solo extraen datos del request, llaman al service y devuelven la respuesta.
- Las respuestas de usuario, evento y ticket pasan por DTO: ninguna expone password.

## Roles y permisos

| Acción | Público | user | organizer | admin |
|--------|:------:|:----:|:---------:|:-----:|
| Ver eventos (listado y detalle) | ✅ | ✅ | ✅ | ✅ |
| Registrarse / iniciar sesión | ✅ | ✅ | ✅ | ✅ |
| Crear evento | ❌ | ❌ | ✅ | ✅ |
| Modificar / cancelar evento | ❌ | ❌ | solo el suyo | ✅ |
| Inscribirse a un evento | ❌ | ✅ | ✅ | ✅ |
| Ver mis tickets | ❌ | ✅ | ✅ | ✅ |
| Ver inscriptos de un evento | ❌ | ❌ | solo el suyo | ✅ |
| Cancelar un ticket | ❌ | el suyo | el suyo | ✅ |

El registro público *siempre* crea usuarios con rol user (el campo role del body se ignora).

## Usuarios de prueba

Con la base conectada, corré:

bash
npm run seed


| Email | Rol |
|-------|-----|
| admin@demo.com | admin |
| organizer@demo.com | organizer |
| organizer2@demo.com | organizer |
| user@demo.com | user |

Contraseña de todos: Test1234 (se puede cambiar con la variable opcional SEED_PASSWORD).

Alternativa manual: registrar un usuario con POST /api/sessions/register y cambiar su campo role (organizer o admin) directamente en la colección users de MongoDB. Después hay que volver a iniciar sesión para que el token tome el nuevo rol.

## Endpoints

### Sesiones

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | /api/health | Público | Estado del servidor |
| POST | /api/sessions/register | Público | Registro (first_name, last_name, email, password) |
| POST | /api/sessions/login | Público | Login: guarda el JWT en la cookie currentUser |
| GET | /api/sessions/current | Logueado | Usuario autenticado |
| POST | /api/sessions/logout | Público | Borra la cookie |

### Eventos

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | /api/events | Público | Listado con filtros, paginación y orden |
| GET | /api/events/:id | Público | Detalle de un evento |
| POST | /api/events | organizer / admin | Crear evento |
| PUT | /api/events/:id | Dueño / admin | Modificar evento |
| PATCH | /api/events/:id/status | Dueño / admin | Cambiar estado (draft, published, cancelled, finished) |

Filtros del listado: status, category, location, dateFrom, dateTo. Paginación: page, limit. Orden: sort (ej. date o -date).

Campos de un evento: title, description, category, date (no puede ser pasada), location, capacity (mayor a 0), price (mayor o igual a 0). Un evento cancelado no se puede modificar y nunca se borra físicamente.

### Tickets / inscripciones

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | /api/events/:id/tickets | Logueado | Inscribirse (quantity, opcional, por defecto 1) |
| GET | /api/events/:id/tickets | Dueño / admin | Inscriptos del evento |
| GET | /api/tickets/my-tickets | Logueado | Mis tickets, con datos básicos del evento |
| PATCH | /api/tickets/:id/cancel | Dueño del ticket / admin | Cancelar (cambia el estado, no elimina) |

Para inscribirse el evento debe estar published, tener cupo suficiente y el usuario no puede tener otra inscripción activa al mismo evento. Los tickets cancelled no cuentan como cupo ocupado.

## Ejemplos de uso

bash
# 1) Login como organizer (la cookie queda en cookies.txt)
curl -c cookies.txt -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"organizer@demo.com","password":"Test1234"}'

# 2) Crear un evento
curl -b cookies.txt -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Congreso Tech 2027","description":"Charlas y talleres","category":"tech","date":"2027-03-15","location":"CABA","capacity":50,"price":0}'

# 3) Publicarlo (reemplazar EVENT_ID por el _id devuelto)
curl -b cookies.txt -X PATCH http://localhost:8080/api/events/EVENT_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"published"}'

# 4) Login como user e inscribirse
curl -c user-cookies.txt -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@demo.com","password":"Test1234"}'

curl -b user-cookies.txt -X POST http://localhost:8080/api/events/EVENT_ID/tickets \
  -H "Content-Type: application/json" \
  -d '{"quantity":1}'

# 5) Ver mis tickets
curl -b user-cookies.txt http://localhost:8080/api/tickets/my-tickets

# 6) Listado paginado
curl "http://localhost:8080/api/events?status=published&page=2&limit=5"


> En PowerShell curl es un alias de Invoke-WebRequest: usá curl.exe, Postman o Thunder Client.

Respuesta del listado:

json
{
  "status": "success",
  "data": [{ "_id": "...", "title": "Congreso Tech 2027", "status": "published" }],
  "page": 2,
  "limit": 5,
  "total": 27,
  "totalPages": 6
}


## Flujo de autenticación

1. POST /api/sessions/register crea el usuario con rol user y la contraseña hasheada con bcrypt.
2. POST /api/sessions/login valida las credenciales con Passport, genera un JWT (solo id y role) y lo guarda en una cookie httpOnly.
3. En cada request protegida, la estrategia current lee la cookie, valida el token y carga el usuario.
4. Sin sesión válida la API responde *401; con sesión pero sin el rol o la propiedad necesaria responde **403*.
5. POST /api/sessions/logout borra la cookie.

## Flujo de inscripción

1. El organizer crea el evento (queda en draft) y lo pasa a published.
2. Un usuario logueado hace POST /api/events/:id/tickets.
3. El service valida: evento publicado, sin inscripción activa duplicada y cupo suficiente.
4. Se crea el ticket con un reservationCode único y se envía el email de confirmación.
5. El usuario puede cancelar su ticket (PATCH /api/tickets/:id/cancel): el cupo se libera y puede volver a inscribirse.

## Manejo de errores

Todas las respuestas de error tienen el mismo formato:

json
{ "status": "error", "message": "Ya tenés una inscripción activa a este evento" }


| Código | Cuándo |
|--------|--------|
| 400 | Datos inválidos, ID mal formado o JSON inválido |
| 401 | No autenticado o credenciales inválidas |
| 403 | Sin permisos (rol o propiedad del recurso) |
| 404 | Recurso o ruta inexistente |
| 409 | Conflicto: email repetido, inscripción duplicada o sin cupo |
| 500 | Error interno (no se expone el detalle) |

## Emails (Nodemailer)

Al confirmarse una inscripción se envía un email con los datos del evento y el código de reserva. Las credenciales viven solo en variables de entorno. Con Gmail hay que activar la verificación en dos pasos y generar una contraseña de aplicación; para pruebas también sirve Mailtrap o  Ethereal.