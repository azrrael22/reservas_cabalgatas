
-- =============================================================
--  TABLA: USUARIOS
-- =============================================================

CREATE TABLE USUARIOS (
    id                  BIGSERIAL       PRIMARY KEY,
    primer_nombre       VARCHAR(100)    NOT NULL,
    primer_apellido     VARCHAR(100)    NOT NULL,
    tipo_documento      VARCHAR(20)     NOT NULL,
    fecha_nacimiento    DATE            NOT NULL,
    documento           VARCHAR(50)     NOT NULL UNIQUE,
    email               VARCHAR(200)    NOT NULL UNIQUE,
    password_hash       VARCHAR(255)    NOT NULL,
    telefono            VARCHAR(20)     NOT NULL,
    role                VARCHAR(20)     NOT NULL DEFAULT 'CLIENTE',
    estado              VARCHAR(10)     NOT NULL DEFAULT 'ACTIVO'

    CONSTRAINT chk_tipo_documento_usuario
        CHECK (tipo_documento IN (
            'CEDULA',
            'PASAPORTE',
            'CEDULA_EXTRANJERIA',
            'TARJETA_IDENTIDAD'
        )
    ),

    CONSTRAINT chk_role
        CHECK (role IN (
            'CLIENTE',
            'ADMIN'
        )
    ),

    CONSTRAINT chk_estado_usuario
        CHECK (
            estado IN (
                'ACTIVO',
                'INACTIVO'
            )
        )
);

COMMENT ON TABLE  USUARIOS               IS 'Usuarios del sistema: CLIENTES y ADMINISTRADORES.';
COMMENT ON COLUMN USUARIOS.password_hash IS 'Contraseña almacenada con hash.';
COMMENT ON COLUMN USUARIOS.tipo_documento IS 'Tipo de documento de un usuario: Pasaporte, Cedula, Cedula de extranjeria, Tarjeta de identidad';
COMMENT ON COLUMN USUARIOS.documento IS 'Numero de identificación correspondiente al tipo de documento';
COMMENT ON COLUMN USUARIOS.telefono IS 'El telefono de un usuario, debe empezar por el indicador de donde esté registrado el telefono, ejemplo: +571111111221';

-- =============================================================
--  TABLA: RUTAS
-- =============================================================

CREATE TABLE RUTAS (
    id                  BIGSERIAL           PRIMARY KEY,
    nombre              VARCHAR(150)        NOT NULL,
    descripcion         TEXT,
    precio              NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    dificultad          VARCHAR(100)        NOT NULL,
    duracion_minutos    INT                 NOT NULL CHECK (duracion_minutos > 0),
    image_url           VARCHAR(500),
    is_active           BOOLEAN             NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_dificultad
        CHECK (dificultad IN ('FACIL', 'MEDIA', 'DIFICIL'))
);

COMMENT ON TABLE  RUTAS                  IS 'Rutas turísticas. Solo los administradores pueden crearlas.';
COMMENT ON COLUMN RUTAS.duracion_minutos IS 'Duración estimada en minutos.';

-- =============================================================
--  TABLA: CABALLOS
-- =============================================================

CREATE TABLE CABALLOS(
    id          BIGSERIAL       PRIMARY KEY,
    nombre      VARCHAR(100)    NOT NULL,
    raza        VARCHAR(100),
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE CABALLOS IS 'Recurso: CABALLOS disponibles para las rutas.';

-- =============================================================
--  TABLA: GUIAS
-- =============================================================

CREATE TABLE GUIAS (
    id                  BIGSERIAL       PRIMARY KEY,
    primer_nombre       VARCHAR(100)    NOT NULL,
    primer_apellido     VARCHAR(100)    NOT NULL,
    tipo_documento      VARCHAR(20)     NOT NULL,
    fecha_nacimiento    DATE            NOT NULL,
    documento           VARCHAR(50)     NOT NULL UNIQUE,
    telefono            VARCHAR(20),
    email               VARCHAR(150),
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_tipo_documento_guia
        CHECK (tipo_documento IN (
            'CEDULA',
            'PASAPORTE',
            'CEDULA_EXTRANJERIA',
            'TARJETA_IDENTIDAD'
        )
    )
);

COMMENT ON TABLE GUIAS IS 'Guías turísticos.';

-- =============================================================
--  TABLA: salidas
--  Una "salida" = una ruta en una fecha y hora concreta.
--  Múltiples reservas pueden unirse a la misma salida.
--  Los recursos se asignan aquí, no en cada reserva.
-- =============================================================

CREATE TABLE salidas (
    id                  BIGSERIAL       PRIMARY KEY,
    ruta_id             BIGINT          NOT NULL REFERENCES rutas (id),
    fecha_programada    DATE            NOT NULL,
    tiempo_inicio       TIME            NOT NULL,
    tiempo_fin          TIME            NOT NULL,
    estado              VARCHAR(50)     NOT NULL DEFAULT 'programado',

    CONSTRAINT chk_salida_tipo CHECK (tiempo_fin > tiempo_inicio),
    CONSTRAINT chk_estado_salida
        CHECK (estado IN ('programado', 'en_curso', 'completado', 'cancelado'))
);

COMMENT ON TABLE  salidas          IS 'Salida concreta (ruta + fecha + hora). Agrupa reservas que viajan juntas.';
COMMENT ON COLUMN salidas.tiempo_fin IS 'tiempo_inicio + duration_minutes de la ruta. Calculado al crear la salida.';

-- =============================================================
--  TABLA: salida_caballos
-- =============================================================

CREATE TABLE salida_caballos (
    id          BIGSERIAL   PRIMARY KEY,
    salida_id   BIGINT      NOT NULL REFERENCES salidas (id) ON DELETE CASCADE,
    horse_id    BIGINT      NOT NULL REFERENCES caballos (id),
    CONSTRAINT uq_salida_caballo UNIQUE (salida_id, horse_id)
);


-- =============================================================
--  TABLA: salida_guias
-- =============================================================

CREATE TABLE salida_guias (
    id          BIGSERIAL   PRIMARY KEY,
    salida_id   BIGINT      NOT NULL REFERENCES salidas (id) ON DELETE CASCADE,
    guia_id     BIGINT      NOT NULL REFERENCES guias (id),
    CONSTRAINT uq_salida_guia UNIQUE (salida_id, guia_id)
);


-- =============================================================
--  TABLA: reservaciones
-- =============================================================

CREATE TABLE reservaciones (
    id                  BIGSERIAL          PRIMARY KEY,
    salida_id           BIGINT             NOT NULL REFERENCES salidas (id),
    client_id           BIGINT             REFERENCES usuarios (id),
    admin_id            BIGINT             REFERENCES usuarios (id),
    num_people          INT                NOT NULL DEFAULT 1 CHECK (num_people > 0),
    precio_unitario     NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0),
    total               NUMERIC(20,2) NOT NULL CHECK (precio_unitario >= 0),
    estado              VARCHAR(50)        NOT NULL DEFAULT 'reservado',

    CONSTRAINT chk_estado_reservacion
        CHECK (estado IN ('reservado', 'en_curso', 'cancelado', 'completado'))
);

COMMENT ON TABLE  reservaciones             IS 'Reserva de un grupo para una salida específica.';
COMMENT ON COLUMN reservaciones.admin_id IS 'NULL si el cliente reservó directamente; si no, un administrador que gestionó la reserva.';
COMMENT ON COLUMN reservaciones.num_people  IS 'Cantidad de personas en el grupo. Debe coincidir con los registros en participantes.';

-- =============================================================
--  TABLA: participantes
--  Datos personales de cada integrante de una reserva.
--  Debe haber exactamente num_people registros por reserva.
-- =============================================================

CREATE TABLE participantes (
    id                  BIGSERIAL       PRIMARY KEY,
    reservacion_id      BIGINT          NOT NULL REFERENCES reservaciones (id) ON DELETE CASCADE,
    primer_nombre       VARCHAR(100)    NOT NULL,
    primer_apellido     VARCHAR(100)    NOT NULL,
    tipo_documento      VARCHAR(20)     NOT NULL,
    documento           VARCHAR(50)     NOT NULL,
    fecha_nacimiento    DATE            NOT NULL,
    altura_cm           SMALLINT        NOT NULL CHECK (altura_cm > 0),
    peso_kg             NUMERIC(5,2)    NOT NULL CHECK (peso_kg > 0),

    CONSTRAINT uq_participant_doc UNIQUE (reservacion_id, tipo_documento, documento),

    CONSTRAINT chk_tipo_documento_participante
        CHECK (tipo_documento IN (
            'CEDULA',
            'PASAPORTE',
            'CEDULA_EXTRANJERIA',
            'TARJETA_IDENTIDAD'
        )
    )
);

COMMENT ON TABLE  participantes                 IS 'Datos personales de cada integrante de una reserva.';
COMMENT ON COLUMN participantes.altura_cm       IS 'Estatura en centímetros (ej. 170).';
COMMENT ON COLUMN participantes.peso_kg         IS 'Peso en kilogramos con hasta 2 decimales (ej. 75.50).';
COMMENT ON COLUMN participantes.documento       IS 'Número de cédula, pasaporte o tarjeta de identidad.';

