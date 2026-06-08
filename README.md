# Cabalgatas Salento — API de Reservas

Backend REST API para la gestión integral de reservas de cabalgatas turísticas de **Cabalgatas Salento**. Permite a los clientes consultar rutas, crear reservas y gestionar sus grupos de participantes, mientras los administradores controlan el catálogo de rutas, caballos, guías y salidas.

![Java 21](https://img.shields.io/badge/Java-21-blue?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-brightgreen?logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Configuración del entorno](#configuración-del-entorno)
- [Inicio rápido](#inicio-rápido)
- [Comandos útiles](#comandos-útiles)
- [Arquitectura](#arquitectura)
- [Modelo de dominio](#modelo-de-dominio)
- [Migraciones Flyway](#migraciones-flyway)
- [API Endpoints](#api-endpoints)
- [Seguridad y autenticación](#seguridad-y-autenticación)
- [Reglas de negocio](#reglas-de-negocio)
- [Tests](#tests)

---

## Tecnologías

| Tecnología | Versión | Rol |
|---|---|---|
| Java | 21 | Lenguaje |
| Spring Boot | 4.0.6 | Framework principal |
| Gradle | 9.5.1 | Build tool |
| PostgreSQL | 17 | Base de datos |
| Flyway | — | Migraciones de BD |
| jjwt | 0.12.6 | Autenticación JWT |
| Lombok | — | Reducción de boilerplate |
| Docker Compose | — | Entorno local |

Módulos Spring utilizados: Web MVC, Data JPA, Security, Validation, DevTools.

---

## Requisitos previos

- **Java 21+** — [Descargar](https://adoptium.net/)
- **Docker** y **Docker Compose** — para levantar PostgreSQL localmente
- El proyecto incluye el Gradle Wrapper (`./gradlew`), no es necesario instalar Gradle

---

## Configuración del entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env
```

Variables requeridas en `.env`:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `POSTGRES_USER` | Usuario de PostgreSQL | `cabalgatas_user` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `s3cr3t` |
| `POSTGRES_DB` | Nombre de la base de datos | `db_cabalgatas` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `JWT_SECRET` | Clave secreta HMAC-SHA en Base64 | *(generar aleatoriamente)* |
| `POSTGRES_TEST_DB` | Base de datos para tests | `db_cabalgatas_test` |

> `bootRun` lee el archivo `.env` automáticamente gracias a la configuración en `build.gradle`. No es necesario exportar variables manualmente.

---

## Inicio rápido

```bash
# 1. Configurar el entorno
cp .env.example .env
# (editar .env con tus credenciales)

# 2. Levantar PostgreSQL
docker-compose up -d

# 3. Arrancar la aplicación
./gradlew bootRun
```

Al arrancar, **Flyway aplica las migraciones automáticamente**. La base de datos queda lista con el esquema completo y datos de prueba incluidos (rutas, caballos y guías).

La API estará disponible en `http://localhost:8080`.

---

## Comandos útiles

```bash
# Compilar sin ejecutar tests
./gradlew build -x test

# Ejecutar todos los tests
./gradlew test

# Ejecutar un test específico
./gradlew test --tests "cabalgatas_salento.reservas.NombreDeClaseTest"

# Ver logs de test con más detalle
./gradlew test --info

# Detener la base de datos
docker-compose down
```

### Perfiles de Spring

| Perfil | Activar con | Características |
|---|---|---|
| `dev` | `-Dspring.profiles.active=dev` | SQL visible en consola, logs en DEBUG |
| `prod` | `-Dspring.profiles.active=prod` | Sin SQL, logs en WARN, pool HikariCP ajustado (10 conexiones) |

---

## Arquitectura

El paquete raíz es `cabalgatas_salento.reservas`.

| Paquete | Responsabilidad |
|---|---|
| `entity/` | Entidades JPA — mapean directamente las tablas SQL |
| `entity/enums/` | Enumeraciones del dominio (roles, estados, tipos de documento) |
| `repository/` | Interfaces `JpaRepository` / `CrudRepository` |
| `service/` | Interfaces de servicio (contratos de negocio) |
| `service/impl/` | Implementaciones de los servicios (`@Service`) |
| `controller/` | Controladores REST (`@RestController`) |
| `dto/request/` | DTOs de entrada — payload de peticiones |
| `dto/response/` | DTOs de salida — payload de respuestas |
| `exception/` | Excepciones de dominio (`RecursoNoEncontradoException`, `ReglaNegocioException`) |
| `exception/handler/` | Manejador global de errores (`@RestControllerAdvice`) |
| `mapper/` | Conversión entre entidades y DTOs |
| `security/` | Filtro JWT, `UserDetailsServiceImpl` |
| `config/` | Configuración de seguridad (`SecurityConfig`) |

Los tests en `src/test/java/cabalgatas_salento/reservas/` siguen la misma estructura de paquetes (`controller/`, `service/`, `repository/`).

---

## Modelo de dominio

### Entidades principales

| Entidad | Descripción |
|---|---|
| **USUARIOS** | Usuarios del sistema con rol `CLIENTE` o `ADMIN`. Implementa `UserDetails` de Spring Security. |
| **RUTAS** | Catálogo de rutas turísticas con dificultad, precio y duración. Soporta soft delete. |
| **CABALLOS** | Recursos de equitación reutilizables. Soporta soft delete. |
| **GUIAS** | Guías turísticos asignados a salidas. Soporta soft delete. |
| **SALIDAS** | Instancia concreta de una ruta en fecha y hora específica. Agrupa múltiples reservas que viajan juntas. |
| **RESERVACIONES** | Reserva de un grupo para una salida. Puede ser creada por un cliente o gestionada por un admin. |
| **PARTICIPANTES** | Datos personales y físicos de cada integrante de una reserva. |

### Relaciones

- Una **SALIDA** pertenece a una **RUTA** y tiene asignados N **CABALLOS** y N **GUIAS** (tablas de unión `salida_caballos` y `salida_guias`).
- Una **RESERVACION** pertenece a una **SALIDA** y tiene N **PARTICIPANTES**.
- `tiempo_fin` de la salida se calcula como `tiempo_inicio + duracion_minutos` de la ruta.
- `total` de la reservación = `precio_unitario × num_people`.

### Flujos de estado

```
SALIDAS:       PROGRAMADO → EN_CURSO → COMPLETADO
                                     → CANCELADO

RESERVACIONES: RESERVADO  → EN_CURSO → COMPLETADO
                                     → CANCELADO
```

---

## Migraciones Flyway

Las migraciones se aplican automáticamente al arrancar la aplicación desde `src/main/resources/db/migration/`.

| Versión | Archivo | Descripción |
|---|---|---|
| V1 | `V1__TABLAS.sql` | Esquema completo: 9 tablas con constraints e índices |
| V2 | `V2__DATOS_PRUEBA.sql` | Datos iniciales: 9 caballos, 6 guías, 8 rutas de Salento |
| V3 | `V3__ADD_ELIMINADO.sql` | Columna `eliminado` (soft delete) en CABALLOS, GUIAS y RUTAS |

---

## API Endpoints

### Autenticación — `/auth` (público)

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/login` | Iniciar sesión — devuelve JWT |
| `POST` | `/auth/registro` | Registrar nuevo cliente |
| `POST` | `/auth/registro-admin` | Registrar primer administrador (solo si no existe ninguno) |

### Rutas — `/rutas`

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/rutas` | Público | Listar todas las rutas |
| `GET` | `/rutas/{id}` | Público | Obtener una ruta por ID |
| `POST` | `/rutas` | ADMIN | Crear ruta |
| `PUT` | `/rutas/{id}` | ADMIN | Actualizar ruta |
| `PATCH` | `/rutas/{id}/activar` | ADMIN | Activar ruta |
| `PATCH` | `/rutas/{id}/desactivar` | ADMIN | Desactivar ruta |
| `DELETE` | `/rutas/{id}` | ADMIN | Eliminar ruta (soft delete) |

### Caballos — `/caballos`

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/caballos` | Público | Listar todos |
| `GET` | `/caballos/{id}` | Público | Obtener por ID |
| `POST` | `/caballos` | ADMIN | Crear caballo |
| `PUT` | `/caballos/{id}` | ADMIN | Actualizar caballo |
| `PATCH` | `/caballos/{id}/activar` | ADMIN | Activar |
| `PATCH` | `/caballos/{id}/desactivar` | ADMIN | Desactivar |
| `DELETE` | `/caballos/{id}` | ADMIN | Eliminar (soft delete) |

### Guías — `/guias`

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/guias` | Público | Listar todos |
| `GET` | `/guias/{id}` | Público | Obtener por ID |
| `POST` | `/guias` | ADMIN | Crear guía |
| `PUT` | `/guias/{id}` | ADMIN | Actualizar guía |
| `PATCH` | `/guias/{id}/activar` | ADMIN | Activar |
| `PATCH` | `/guias/{id}/desactivar` | ADMIN | Desactivar |
| `DELETE` | `/guias/{id}` | ADMIN | Eliminar (soft delete) |

### Salidas — `/salidas`

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/salidas` | Público | Listar todas las salidas |
| `GET` | `/salidas/{id}` | Público | Obtener una salida |
| `PATCH` | `/salidas/{id}/cancelar` | ADMIN | Cancelar salida |

### Reservaciones — `/reservaciones`

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/admin/reservaciones` | ADMIN | Admin crea una reservación |
| `POST` | `/reservaciones` | CLIENTE | Cliente crea su propia reservación |
| `PUT` | `/reservaciones/{id}` | CLIENTE (propietario) | Actualizar reservación |
| `PATCH` | `/reservaciones/{id}/cancelar` | CLIENTE (propietario) | Cancelar reservación |
| `GET` | `/reservaciones/mis-reservas` | CLIENTE | Listar mis reservaciones |
| `GET` | `/reservaciones/{id}` | CLIENTE (propietario) o ADMIN | Ver detalle de una reservación |

---

## Seguridad y autenticación

La API usa **JWT stateless** — no hay sesiones en el servidor.

- **Header requerido:** `Authorization: Bearer <token>`
- **Expiración del token:** 24 horas
- **Algoritmo:** HMAC-SHA con clave en Base64 (`JWT_SECRET`)
- **Contraseñas:** almacenadas con BCrypt

### Clasificación de rutas

| Acceso | Rutas |
|---|---|
| Público | `POST /auth/**`, `GET /rutas/**`, `GET /caballos/**`, `GET /guias/**`, `GET /salidas/**` |
| ADMIN | `POST/PUT/PATCH/DELETE /rutas`, `/caballos`, `/guias`; `PATCH /salidas/*/cancelar`; `/admin/**` |
| Autenticado | Todas las demás rutas |

---

## Reglas de negocio

- `reservaciones.num_people` debe coincidir exactamente con el número de registros en `participantes`.
- `total = precio_unitario × num_people` (calculado automáticamente).
- `tiempo_fin` de una salida = `tiempo_inicio + duracion_minutos` de la ruta asociada.
- `tipo_documento` acepta únicamente: `CEDULA`, `PASAPORTE`, `CEDULA_EXTRANJERIA`, `TARJETA_IDENTIDAD` (aplica a USUARIOS, GUIAS y PARTICIPANTES).
- Los teléfonos deben incluir el indicativo internacional (ej.: `+571111111221`).
- `altura_cm` y `peso_kg` de participantes deben ser valores positivos (validación física para equitación).
- `precio_unitario`, `total` y `rutas.precio` nunca pueden ser negativos.
- El campo `admin_id` en `reservaciones` es nullable: es `NULL` cuando la reservación la crea el propio cliente.

### Anomalías de nomenclatura en el esquema SQL

Dos columnas tienen nombres que no siguen la convención en español del resto del esquema:

| Tabla | Columna en SQL | Mapeo en entidad |
|---|---|---|
| `salida_caballos` | `horse_id` | `@Column(name = "horse_id")` |
| `reservaciones` | `client_id` | `@Column(name = "client_id")` |

---

## Tests

Los tests se ubican en `src/test/java/cabalgatas_salento/reservas/` siguiendo la misma estructura de paquetes que el código principal.

```
src/test/java/cabalgatas_salento/reservas/
├── controller/    # Tests de controladores REST (MockMvc)
├── service/       # Tests unitarios de servicios
├── repository/    # Tests de repositorios JPA
└── ReservasApplicationTests.java
```

**Configuración de tests:** `src/test/resources/application-test.properties` apunta a la base de datos de prueba (`POSTGRES_TEST_DB`).

**Starters disponibles:**
- `spring-boot-starter-webmvc-test` → `MockMvc` para controladores
- `spring-boot-starter-data-jpa-test` → `@DataJpaTest` para repositorios
- `spring-boot-starter-flyway-test` → migraciones en tests de integración

```bash
# Ejecutar todos los tests
./gradlew test

# Test específico con logs detallados
./gradlew test --tests "cabalgatas_salento.reservas.service.ReservacionServiceTest" --info
```
