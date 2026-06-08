-- =============================================================
--  V2__DATOS_PRUEBA.sql
--  Datos de prueba / desarrollo para el sistema de cabalgatas
--  turísticas de Salento, Colombia.
--
--  IMPORTANTE: Este archivo es exclusivamente para entornos
--  de desarrollo y pruebas. No debe aplicarse en producción
--  con datos reales de clientes.
-- =============================================================


-- =============================================================
--  CABALLOS  (9 registros — 2 inactivos)
-- =============================================================

INSERT INTO CABALLOS (nombre, raza, is_active) VALUES
    ('Canela',      'Paso Fino Colombiano',     TRUE),
    ('Trueno',      'Criollo Colombiano',        TRUE),
    ('Palomo',      'Paso Fino Colombiano',      TRUE),
    ('Cielo',       'Trocha y Galope',           TRUE),
    ('Lucero',      'Paso Fino Colombiano',      TRUE),
    ('Ventarrón',   'Criollo Colombiano',        TRUE),
    ('Relámpago',   'Lusitano',                  TRUE),
    ('Esmeralda',   'Andaluz',                   FALSE),
    ('Cometa',      'Trocha y Galope',           FALSE);


-- =============================================================
--  GUIAS  (6 registros — 1 inactivo)
--  Edades entre 28 y 50 años referenciadas al 2026-06-08.
--  Teléfonos con indicativo internacional +57.
-- =============================================================

INSERT INTO GUIAS (
    primer_nombre,
    primer_apellido,
    tipo_documento,
    fecha_nacimiento,
    documento,
    telefono,
    email,
    is_active
) VALUES
    ('Carlos Andrés',  'Ríos Salazar',      'CEDULA',    '1987-03-14', '10234567',   '+573126784512', 'carlos.rios@cabalgatas-salento.co',    TRUE),
    ('Jorge Iván',     'Bermúdez Lopera',   'CEDULA',    '1981-07-22', '75312489',   '+573017654321', NULL,                                   TRUE),
    ('Luisa Fernanda', 'Cardona Arango',    'CEDULA',    '1994-11-05', '1095803214', '+573206541897', 'luisa.cardona@gmail.com',              TRUE),
    ('Hernando',       'Ocampo Vélez',      'CEDULA',    '1976-01-30', '10111222',   '+573145678901', NULL,                                   TRUE),
    ('Marco',          'Albanese',          'PASAPORTE', '1997-09-18', 'YB4821930',  '+573058763412', 'marco.albanese@outlook.com',           TRUE),
    ('Paola Andrea',   'Giraldo Muñoz',     'CEDULA',    '1993-04-02', '43987654',   '+573112340987', 'paola.giraldo@cabalgatas-salento.co',  FALSE);


-- =============================================================
--  RUTAS  (8 registros — 1 inactiva)
--  Distribución: 2 FACIL, 3 MEDIA, 3 DIFICIL.
--  Precios en COP. Duraciones en minutos.
-- =============================================================

INSERT INTO RUTAS (nombre, descripcion, precio, dificultad, duracion_minutos, image_url, is_active) VALUES
    (
        'Paseo por el Pueblo Mágico',
        'Recorrido tranquilo por los alrededores de Salento, bordeando cultivos de café y casas de bahareque. Ideal para familias y principiantes que quieran conocer el corazón del Eje Cafetero a lomo de caballo.',
        55000.00, 'FACIL', 70, NULL, TRUE
    ),
    (
        'Finca Cafetera La Esperanza',
        'Cabalgata suave hasta una finca cafetera tradicional del Quindío. El recorrido incluye una parada donde los visitantes pueden observar el proceso de recolección y beneficio del café de origen, con vistas al cañón del río Quindío.',
        70000.00, 'FACIL', 90, NULL, TRUE
    ),
    (
        'Mirador Alto de la Cruz',
        'Ascenso moderado hasta el Alto de la Cruz, donde una imponente estatua de Cristo custodia el horizonte cafetero. Desde la cima se avistan los volcanes Nevado del Ruiz, Santa Isabel y Tolima. Requiere experiencia básica.',
        95000.00, 'MEDIA', 120, NULL, TRUE
    ),
    (
        'Riberas del Río Quindío',
        'Cabalgata a lo largo de las riberas del río Quindío entre bambusales y guaduales centenarios. El sendero cruza tres pequeños vados de aguas cristalinas donde los jinetes disfrutarán del frescor de la selva andina.',
        85000.00, 'MEDIA', 110, NULL, TRUE
    ),
    (
        'Cañón del Río Barragán',
        'Ruta de media jornada que desciende por las estribaciones del Barragán hasta un mirador sobre el cañón. Flora endémica, orquídeas silvestres y el canto del toche son los protagonistas. Apta para jinetes con experiencia moderada.',
        100000.00, 'MEDIA', 150, NULL, FALSE
    ),
    (
        'Travesía al Valle del Cocora',
        'La joya de la corona: cabalgata de largo aliento hasta el Valle del Cocora, cuna de la palma de cera, árbol nacional de Colombia. El sendero atraviesa bosque de niebla, cruza puentes colgantes y quebradas de agua helada. Palmeras de hasta 60 metros al final.',
        160000.00, 'DIFICIL', 270, NULL, TRUE
    ),
    (
        'Cumbre de la Serranía de los Paraguas',
        'Ruta técnica para jinetes experimentados. El ascenso bordea precipicios cubiertos de niebla permanente y alcanza páramo abierto donde habitan el oso de anteojos y el cóndor de los Andes. Equipaje impermeable obligatorio.',
        190000.00, 'DIFICIL', 300, NULL, TRUE
    ),
    (
        'Cresta de los Tucanes',
        'Circuito de alta montaña que conecta tres fincas cafeteras por senderos de herradura casi olvidados. El perfil de elevación supera 800 m de desnivel acumulado, con vistas de 360 grados desde el punto más alto. Solo para jinetes con experiencia avanzada.',
        200000.00, 'DIFICIL', 300, NULL, TRUE
    );
