# Mini ERP

Mini ERP de ejemplo con:

- Backend en Spring Boot + JWT
- Frontend en Angular
- PostgreSQL como base de datos
- Gestión de inventario por almacén
- Cotizaciones con cálculo de IGV y descuento automático de stock

## 1. Estructura de carpetas

```text
.
|-- backend
|   |-- pom.xml
|   `-- src/main/java/com/minierp
|       |-- config
|       |-- controller
|       |-- dto
|       |-- entity
|       |-- exception
|       |-- repository
|       |-- security
|       `-- service
|-- frontend
|   |-- package.json
|   `-- src/app
|       |-- core
|       |   |-- guards
|       |   |-- interceptors
|       |   `-- services
|       |-- features
|       |   |-- cotizaciones
|       |   |-- dashboard
|       |   |-- inventario
|       |   `-- login
|       `-- shared/models
|-- sql
|   `-- minierp.sql
`-- render.yaml
```

## 2. Backend

Puntos principales ya incluidos:

- Seguridad JWT con `Spring Security`
- Endpoint `POST /api/auth/login`
- CRUD base para clientes, categorías, productos, almacenes y usuarios
- Inventario por almacén en `GET /api/inventario`
- Registro de movimientos en `POST /api/inventario/movimientos`
- Generación de cotizaciones en `POST /api/cotizaciones`
- Descuento automático de stock al crear una cotización

Usuario inicial:

- `admin`
- `Admin123*`

Ese usuario se crea automáticamente al iniciar el backend si aún no existe.

Variables de entorno importantes:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`

## 3. Frontend

Módulos/pantallas incluidos:

- `login`
- `dashboard`
- `inventario`
- `cotizaciones`

También incluye:

- `auth guard`
- `HTTP interceptor` para JWT
- polling de inventario cada 5 segundos
- formulario de cotización con cálculo estimado de subtotal, IGV y total

## 4. Base de datos

Archivo SQL disponible en [sql/minierp.sql](C:/proyectos/Nueva%20carpeta/sql/minierp.sql).

Tablas incluidas:

- `roles`
- `usuarios`
- `clientes`
- `categorias`
- `productos`
- `almacenes`
- `inventario`
- `movimientos_inventario`
- `cotizaciones`
- `cotizacion_detalle`

## 5. Cómo ejecutar

### PostgreSQL local o Supabase

1. Crear una base llamada `minierp` o usar una instancia externa.
2. Ejecutar el script `sql/minierp.sql`.
3. Configurar las variables del backend.

Ejemplo para Supabase:

```properties
DB_URL=jdbc:postgresql://db.<tu-proyecto>.supabase.co:5432/postgres?sslmode=require
DB_USERNAME=postgres
DB_PASSWORD=tu_password
JWT_SECRET=una-clave-segura-de-al-menos-32-caracteres
```

### Backend

Requisitos:

- Java 17+ o Java 21
- Maven 3.9+

Ejecutar:

```bash
cd backend
mvn spring-boot:run
```

La API quedará disponible en `http://localhost:8080`.

### Frontend

Requisitos:

- Node.js 20+
- Angular CLI 18+

Ejecutar:

```bash
cd frontend
npm install
npm start
```

La aplicación quedará disponible en `http://localhost:4200`.

## 6. Flujo de prueba rápido

1. Iniciar sesión con `admin / Admin123*`.
2. Registrar una entrada de inventario.
3. Crear una cotización con uno o más productos.
4. Revisar que el stock del almacén se descuente automáticamente.

## 7. Notas

- El backend usa `spring.jpa.hibernate.ddl-auto=update` para facilitar el arranque local.
- Si prefieres un flujo más controlado, puedes cambiarlo a `validate` y manejar todo con SQL/migraciones.
- `render.yaml` deja una base para desplegar API y frontend en Render.
