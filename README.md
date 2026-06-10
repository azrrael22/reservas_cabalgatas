# Reservas Cabalgatas Salento — API REST

API REST para la gestión integral de reservas de cabalgatas turísticas en Salento, Colombia. Permite administrar rutas, salidas, caballos, guías, reservaciones y participantes, con autenticación JWT y control de roles.

---

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Configuración inicial](#configuración-inicial)
- [Comandos de desarrollo](#comandos-de-desarrollo)
- [Base de datos](#base-de-datos)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Seguridad y autenticación](#seguridad-y-autenticación)
- [Modelo de dominio](#modelo-de-dominio)
- [Referencia de la API](#referencia-de-la-api)
- [Manejo de errores](#manejo-de-errores)
- [Restricciones de dominio](#restricciones-de-dominio)

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| **Node.js** | 20+ | Entorno de ejecución |
| **NestJS** | 10 | Framework HTTP |
| **TypeScript** | 5.1 | Lenguaje |
| **TypeORM** | 0.3 | ORM y migraciones |
| **PostgreSQL** | 17 | Base de datos |
| **passport-jwt** | 4 | Autenticación JWT |
| **bcryptjs** | 2.4 | Hash de contraseñas |
| **class-validator** | 0.14 | Validación de DTOs |
| **Docker** | — | Contenedor de PostgreSQL |

---

## Requisitos previos

- Node.js 20 o superior
- npm
- Docker y Docker Compose

---

## Configuración inicial

**1. Instalar dependencias**

```bash
cd reservas_cabalgatas
npm install
```

**2. Crear el archivo de variables de entorno**

```bash
cp .env.example .env
```

Editar `.env` con los valores correspondientes:

```env
POSTGRES_USER=tu_usuario
POSTGRES_PASSWORD=tu_contraseña
POSTGRES_DB=db_cabalgatas
DB_HOST=localhost
DB_PORT=5432
POSTGRES_TEST_DB=db_cabalgatas_test
JWT_SECRET=<cadena base64 de al menos 32 bytes>
PORT=3000
```

> Para generar un `JWT_SECRET` seguro: `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`

**3. Levantar la base de datos**

```bash
docker-compose up -d
```

Esto inicia un contenedor PostgreSQL 17 en el puerto configurado (`5432` por defecto). El contenedor incluye un `healthcheck` que verifica que la base esté lista antes de aceptar conexiones.

---

## Comandos de desarrollo

```bash
# Desarrollo con hot-reload
npm run start:dev

# Compilar el proyecto
npm run build

# Ejecutar en producción (requiere build previo)
npm run start:prod

# Formatear el código
npm run format

# Ejecutar migraciones manualmente
npm run migration:run

# Revertir la última migración
npm run migration:revert
```

> Las migraciones se aplican automáticamente al arrancar la aplicación (`migrationsRun: true` en la configuración de TypeORM). No es necesario ejecutarlas manualmente en desarrollo.

La API queda disponible en `http://localhost:3000` (o el puerto definido en `PORT`).

---

## Base de datos

PostgreSQL 17 gestionado por Docker. Las migraciones son versionadas y se ejecutan con TypeORM.

### Conexión

| Parámetro | Valor por defecto |
|---|---|
| Host | `localhost` |
| Puerto | `5432` |
| Base de datos (dev) | `db_cabalgatas` |
| Base de datos (test) | `db_cabalgatas_test` |

### Migraciones

Las migraciones están en `src/database/migrations/` con timestamps de 13 dígitos como prefijo:

| Archivo | Contenido |
|---|---|
| `1700000001-V1Tablas.ts` | Esquema completo inicial (todas las tablas) |
| `1700000002-V2Datos.ts` | Datos de prueba |
| `1700000003-V3Eliminado.ts` | Agrega columna `eliminado BOOLEAN` a caballos, guías y rutas |

Para agregar una nueva migración, crear un archivo en `src/database/migrations/` con un timestamp mayor al último existente y el nombre descriptivo, e implementar los métodos `up()` y `down()`.

### Detener la base de datos

```bash
docker-compose down
```

Para eliminar también el volumen de datos:

```bash
docker-compose down -v
```

---

## Arquitectura del proyecto

```
src/
├── main.ts                        # Bootstrap de la aplicación
├── app.module.ts                  # Módulo raíz (TypeORM, config, módulos de dominio)
├── auth/                          # Autenticación JWT
│   ├── decorators/                # @Public(), @Roles(), @CurrentUser()
│   ├── dto/                       # LoginDto, RegistroDto, LoginResponseDto
│   ├── guards/                    # JwtAuthGuard, RolesGuard
│   ├── strategies/                # JwtStrategy (passport)
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── usuarios/
│   └── entities/usuario.entity.ts # Entidad Usuario, enums RolUsuario / TipoDocumento
├── rutas/                         # CRUD de rutas turísticas
├── caballos/                      # CRUD de caballos
├── guias/                         # CRUD de guías
├── salidas/                       # Consulta y cancelación de salidas
├── reservaciones/                 # Reservaciones y participantes
├── common/
│   ├── exceptions/                # RecursoNoEncontradoException, ReglaNegocioException
│   └── filters/                   # HttpExceptionFilter (formato RFC 9457)
└── database/
    ├── data-source.ts             # DataSource para CLI de TypeORM
    └── migrations/                # Archivos de migración versionados
```

Cada módulo de dominio sigue la misma estructura interna:

```
<modulo>/
├── entities/       # Entidades TypeORM (@Entity)
├── dto/            # DTOs de entrada y salida con validaciones
├── repository/     # Interfaz del repositorio + implementación TypeORM
├── mappers/        # Conversión entity ↔ DTO
├── <modulo>.service.ts
├── <modulo>.controller.ts
└── <modulo>.module.ts
```

---

## Seguridad y autenticación

La API usa **JWT Bearer tokens** con sesiones stateless.

### Flujo de autenticación

1. El cliente llama a `POST /auth/login` o `POST /auth/registro` y recibe un JWT.
2. Todas las rutas protegidas requieren el header `Authorization: Bearer <token>`.
3. `JwtAuthGuard` valida el token en cada petición y carga el usuario en el contexto de seguridad.
4. `RolesGuard` verifica el rol del usuario según el decorador `@Roles()` en el controlador.

### Decoradores disponibles

| Decorador | Efecto |
|---|---|
| `@Public()` | Marca la ruta como pública (sin JWT) |
| `@Roles(RolUsuario.ADMIN)` | Restringe la ruta al rol ADMIN |
| `@CurrentUser()` | Inyecta el `Usuario` autenticado en el parámetro |

### Reglas de autorización por recurso

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/auth/**` | Público |
| GET | `/rutas/**`, `/salidas/**` | Público |
| POST/PUT/PATCH/DELETE | `/rutas/**` | Solo ADMIN |
| GET/POST/PUT/PATCH/DELETE | `/caballos/**` | Solo ADMIN |
| GET/POST/PUT/PATCH/DELETE | `/guias/**` | Solo ADMIN |
| PATCH | `/salidas/:id/cancelar` | Solo ADMIN |
| POST | `/admin/reservaciones` | Solo ADMIN |
| POST/GET/PUT/PATCH | `/reservaciones/**` | Autenticado |

> `POST /auth/registro-admin` solo funciona cuando no existe ningún administrador en el sistema.

---

## Modelo de dominio

### Entidades principales

```
USUARIOS
  └── tiene muchas RESERVACIONES (como cliente)

RUTAS
  └── tiene muchas SALIDAS

SALIDAS
  ├── tiene muchos CABALLOS (via salida_caballos)
  ├── tiene muchos GUIAS (via salida_guias)
  └── tiene muchas RESERVACIONES

RESERVACIONES
  └── tiene muchos PARTICIPANTES
```

### Flujos de estado

**Salidas:** `programado` → `en_curso` → `completado | cancelado`

**Reservaciones:** `reservado` → `en_curso` → `completado | cancelado`

### Enums

**`RolUsuario`:** `CLIENTE` | `ADMIN`

**`EstadoUsuario`:** `ACTIVO` | `INACTIVO`

**`TipoDocumento`:** `CEDULA` | `PASAPORTE` | `CEDULA_EXTRANJERIA` | `TARJETA_IDENTIDAD`

**`DificultadRuta`:** `FACIL` | `MEDIA` | `DIFICIL`

**`EstadoSalida`:** `programado` | `en_curso` | `completado` | `cancelado`

**`EstadoReservacion`:** `reservado` | `en_curso` | `completado` | `cancelado`

### Borrado lógico

Las entidades `Caballo`, `Guia` y `Ruta` implementan borrado lógico con la columna `eliminado BOOLEAN`. Un registro con `eliminado = true` no puede reactivarse.

---

## Referencia de la API

### Autenticación — `/auth`

#### `POST /auth/registro`
Registra un nuevo usuario con rol CLIENTE.

**Body:**
```json
{
  "primerNombre": "Juan",
  "primerApellido": "García",
  "tipoDocumento": "CEDULA",
  "fechaNacimiento": "1990-05-15",
  "documento": "1234567890",
  "email": "juan@example.com",
  "password": "secreto123",
  "telefono": "+573001234567"
}
```

**Respuesta `201`:**
```json
{
  "accessToken": "<jwt>"
}
```

---

#### `POST /auth/login`
Autentica un usuario existente.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "secreto123"
}
```

**Respuesta `200`:**
```json
{
  "accessToken": "<jwt>"
}
```

---

#### `POST /auth/registro-admin`
Crea el primer administrador del sistema. Solo funciona cuando no existe ningún admin.

Body idéntico a `/auth/registro`.

---

### Rutas — `/rutas`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/rutas` | Público | Lista todas las rutas activas |
| GET | `/rutas/:id` | Público | Obtiene una ruta por ID |
| POST | `/rutas` | ADMIN | Crea una nueva ruta |
| PUT | `/rutas/:id` | ADMIN | Actualiza una ruta |
| PATCH | `/rutas/:id/activar` | ADMIN | Activa una ruta (`204`) |
| PATCH | `/rutas/:id/desactivar` | ADMIN | Desactiva una ruta (`204`) |
| DELETE | `/rutas/:id` | ADMIN | Elimina lógicamente una ruta (`204`) |

**Body para POST/PUT:**
```json
{
  "nombre": "Ruta del Bosque",
  "descripcion": "Recorrido por el bosque de palma de cera",
  "precio": 45000.00,
  "dificultad": "FACIL",
  "duracionMinutos": 120,
  "imageUrl": "https://example.com/imagen.jpg"
}
```

---

### Caballos — `/caballos` *(solo ADMIN)*

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/caballos` | Lista todos los caballos |
| GET | `/caballos/:id` | Obtiene un caballo por ID |
| POST | `/caballos` | Crea un nuevo caballo |
| PUT | `/caballos/:id` | Actualiza un caballo |
| PATCH | `/caballos/:id/activar` | Activa un caballo (`204`) |
| PATCH | `/caballos/:id/desactivar` | Desactiva un caballo (`204`) |
| DELETE | `/caballos/:id` | Elimina lógicamente un caballo (`204`) |

---

### Guías — `/guias` *(solo ADMIN)*

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/guias` | Lista todos los guías |
| GET | `/guias/:id` | Obtiene un guía por ID |
| POST | `/guias` | Crea un nuevo guía |
| PUT | `/guias/:id` | Actualiza un guía |
| PATCH | `/guias/:id/activar` | Activa un guía (`204`) |
| PATCH | `/guias/:id/desactivar` | Desactiva un guía (`204`) |
| DELETE | `/guias/:id` | Elimina lógicamente un guía (`204`) |

---

### Salidas — `/salidas`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/salidas` | Público | Lista todas las salidas |
| GET | `/salidas/:id` | Público | Obtiene una salida por ID |
| PATCH | `/salidas/:id/cancelar` | ADMIN | Cancela una salida (`204`) |

> Las salidas son creadas internamente al recibir una reservación (cuando no existe salida previa para la ruta/fecha/hora). `tiempo_fin` se calcula como `tiempo_inicio + duracion_minutos` de la ruta.

---

### Reservaciones

#### `POST /reservaciones` *(autenticado)*
El cliente crea una reserva para sí mismo. Si no existe una salida para la ruta/fecha/hora indicadas, se crea automáticamente.

**Body:**
```json
{
  "rutaId": 1,
  "fechaProgramada": "2026-07-15",
  "tiempoInicio": "08:00:00",
  "numPeople": 2,
  "participantes": [
    {
      "primerNombre": "Ana",
      "primerApellido": "López",
      "tipoDocumento": "CEDULA",
      "documento": "987654321",
      "fechaNacimiento": "1995-03-20",
      "alturaCm": 165,
      "pesoKg": 60
    },
    {
      "primerNombre": "Carlos",
      "primerApellido": "Pérez",
      "tipoDocumento": "PASAPORTE",
      "documento": "AB123456",
      "fechaNacimiento": "1992-11-08",
      "alturaCm": 178,
      "pesoKg": 75
    }
  ]
}
```

**Respuesta `201`:** objeto `ReservacionResponseDto` con total calculado (`precio_unitario × num_people`).

---

#### `POST /admin/reservaciones` *(solo ADMIN)*
El administrador crea una reserva en nombre de un cliente específico.

**Body:** igual que el anterior, pero incluye adicionalmente:
```json
{
  "clienteId": 5,
  ...
}
```

---

#### `PUT /reservaciones/:id` *(autenticado)*
Actualiza una reservación existente. Solo el propietario o un admin puede modificarla.

---

#### `PATCH /reservaciones/:id/cancelar` *(autenticado)*
Cancela una reservación. Solo el propietario o un admin puede cancelarla. Devuelve `204`.

---

#### `GET /reservaciones/mis-reservas` *(autenticado)*
Lista todas las reservaciones del usuario autenticado.

---

#### `GET /reservaciones/:id` *(autenticado)*
Obtiene el detalle de una reservación por ID.

---

## Manejo de errores

Todos los errores siguen el formato **RFC 9457 (Problem Details)**:

```json
{
  "type": "about:blank",
  "title": "Descripción del error",
  "status": 404,
  "detail": "Mensaje detallado del problema"
}
```

Los errores de validación (`400`) incluyen adicionalmente un mapa `errores`:

```json
{
  "type": "about:blank",
  "title": "Error de validación",
  "status": 400,
  "detail": "Los datos enviados no son válidos",
  "errores": {
    "email": "email debe ser un correo válido",
    "telefono": "telefono debe incluir indicativo internacional (ej: +573001234567)"
  }
}
```

| Excepción | HTTP | Cuándo |
|---|---|---|
| `RecursoNoEncontradoException` | `404` | Entidad no existe en BD |
| `ReglaNegocioException` | `422` | Violación de regla de negocio |
| `BadRequestException` / validación | `400` | DTO inválido |
| `UnauthorizedException` | `401` | Token ausente o inválido |
| `ForbiddenException` | `403` | Rol insuficiente |
| Error no controlado | `500` | Error inesperado en el servidor |

---

## Restricciones de dominio

- **Teléfonos** deben incluir indicativo internacional (ej: `+573001234567`).
- **`numPeople`** de una reservación debe coincidir exactamente con el número de `participantes` enviados.
- **`precio`, `total`, `precio_unitario`** nunca pueden ser negativos.
- **`alturaCm`** y **`pesoKg`** de los participantes deben ser valores positivos.
- **Borrado lógico** (`eliminado = true`) es irreversible: un recurso eliminado no puede reactivarse.
- `POST /auth/registro-admin` solo crea el primer admin; lanza error si ya existe alguno.
- Los estados de salida y reservación siguen un flujo unidireccional y no pueden retroceder.
