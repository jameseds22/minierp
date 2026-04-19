CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    rol_id BIGINT NOT NULL REFERENCES roles(id)
);

CREATE TABLE clientes (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(120),
    telefono VARCHAR(20)
);

CREATE TABLE categorias (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(250)
);

CREATE TABLE productos (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(250),
    costo NUMERIC(12,2) NOT NULL,
    precio NUMERIC(12,2) NOT NULL,
    categoria_id BIGINT NOT NULL REFERENCES categorias(id)
);

CREATE TABLE almacenes (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    direccion VARCHAR(200)
);

CREATE TABLE inventario (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT NOT NULL REFERENCES productos(id),
    almacen_id BIGINT NOT NULL REFERENCES almacenes(id),
    stock INTEGER NOT NULL DEFAULT 0,
    UNIQUE (producto_id, almacen_id)
);

CREATE TABLE movimientos_inventario (
    id BIGSERIAL PRIMARY KEY,
    inventario_id BIGINT NOT NULL REFERENCES inventario(id),
    tipo VARCHAR(20) NOT NULL,
    cantidad INTEGER NOT NULL,
    motivo VARCHAR(250),
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cotizaciones (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id),
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    almacen_id BIGINT NOT NULL REFERENCES almacenes(id),
    estado VARCHAR(20) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    igv NUMERIC(12,2) NOT NULL,
    total NUMERIC(12,2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cotizacion_detalle (
    id BIGSERIAL PRIMARY KEY,
    cotizacion_id BIGINT NOT NULL REFERENCES cotizaciones(id) ON DELETE CASCADE,
    producto_id BIGINT NOT NULL REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(12,2) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL
);

INSERT INTO roles (nombre) VALUES ('ADMIN'), ('VENDEDOR');

INSERT INTO categorias (nombre, descripcion) VALUES
('Laptops', 'Equipos portatiles'),
('Accesorios', 'Perifericos y accesorios');

INSERT INTO almacenes (nombre, direccion) VALUES
('Principal', 'Av. Principal 100'),
('Secundario', 'Av. Industrial 250');

INSERT INTO clientes (nombre, documento, email, telefono) VALUES
('Empresa Demo SAC', '20600000001', 'compras@demo.com', '999111222'),
('Cliente Mostrador', '10456789012', 'ventas@cliente.com', '988777666');

INSERT INTO productos (sku, nombre, descripcion, costo, precio, categoria_id) VALUES
('LAP-001', 'Laptop Pro 14', 'Laptop empresarial 16GB RAM', 3500.00, 4200.00, 1),
('ACC-001', 'Mouse Inalambrico', 'Mouse ergonomico', 55.00, 85.00, 2),
('ACC-002', 'Teclado Mecanico', 'Teclado para oficina', 120.00, 190.00, 2);

INSERT INTO inventario (producto_id, almacen_id, stock) VALUES
(1, 1, 15),
(2, 1, 40),
(3, 1, 20),
(1, 2, 8),
(2, 2, 25);
