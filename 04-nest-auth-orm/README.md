# API de Tienda con NestJS, TypeORM y Autenticación JWT

Este proyecto es una API RESTful para la gestión de productos de una tienda, desarrollada con NestJS, TypeORM y PostgreSQL. Incluye autenticación y autorización basada en JWT, manejo de archivos (imágenes de productos), y un endpoint de seed para inicializar la base de datos.

---

## Tabla de Endpoints

| Recurso   | Método | Endpoint                        | Descripción                         |
| --------- | ------ | ------------------------------- | ----------------------------------- |
| Productos | POST   | `/api/products`                 | Crear producto (requiere auth)      |
| Productos | GET    | `/api/products`                 | Listar productos (paginado)         |
| Productos | GET    | `/api/products/:term`           | Obtener producto por id/slug/name   |
| Productos | PATCH  | `/api/products/:id`             | Actualizar producto (requiere auth) |
| Productos | DELETE | `/api/products/:id`             | Eliminar producto (requiere auth)   |
| Archivos  | POST   | `/api/files/product`            | Subir imagen de producto            |
| Archivos  | GET    | `/api/files/product/:imageName` | Obtener imagen de producto          |
| Seed      | POST   | `/api/seed`                     | Inicializar base de datos           |
| Auth      | POST   | `/api/auth/signup`              | Registro de usuario                 |
| Auth      | POST   | `/api/auth/signin`              | Login de usuario                    |
| Auth      | GET    | `/api/auth/check-status`        | Verificar autenticación (JWT)       |

---

## Stack Tecnológico

- **NestJS** como framework principal
- **TypeORM** para acceso a datos
- **PostgreSQL** como base de datos relacional
- **JWT** para autenticación y autorización
- **class-validator** para validación de DTOs
- **Manejo de archivos** para imágenes de productos

---

## Instalación y Ejecución

1. Clona el repositorio y navega al proyecto.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env` (ver `.env.example`).
4. Levanta la base de datos con Docker (opcional):
   ```bash
   docker-compose up -d
   ```
5. Ejecuta la aplicación:
   ```bash
   npm run start:dev
   ```

---

## Autenticación y Protección de Rutas

- El registro y login devuelven un JWT que debe enviarse en el header `Authorization: Bearer <token>`.
- Para proteger rutas, se usa el decorador `@Auth()` y se pueden especificar roles:

```typescript
@Auth(ValidRoles.admin)
@Post()
create(@Body() dto: CreateProductDto, @GetUser() user: User) {
  return this.productsService.create(dto, user);
}
```

- Los roles disponibles son: `user`, `admin`, `superuser`.

---

# Documentación de Endpoints y Funcionalidades

## Productos (`/api/products`)

CRUD para productos de tienda.

### Crear producto

**POST** `/api/products`

Request:

```json
{
  "name": "Camiseta Tesla",
  "price": 35,
  "gender": "men",
  "description": "Camiseta oficial Tesla",
  "slug": "camiseta-tesla",
  "stock": 10,
  "sizes": ["S", "M", "L"],
  "tags": ["camiseta", "tesla"],
  "images": ["100042301_0_2000.jpg"]
}
```

Response:

```json
{
  "id": "uuid",
  "name": "Camiseta Tesla",
  "price": 35,
  "gender": "men",
  "description": "Camiseta oficial Tesla",
  "slug": "camiseta-tesla",
  "stock": 10,
  "sizes": ["S", "M", "L"],
  "tags": ["camiseta", "tesla"],
  "images": ["100042301_0_2000.jpg"]
}
```

### Listar productos

**GET** `/api/products?limit=10&offset=0`

Response:

```json
[
  {
    "id": "uuid",
    "name": "Camiseta Tesla",
    ...
  },
  ...
]
```

### Obtener producto por id/slug/name

**GET** `/api/products/:term`

Response:

```json
{
  "id": "uuid",
  "name": "Camiseta Tesla",
  ...
}
```

### Actualizar producto

**PATCH** `/api/products/:id`

Request:

```json
{
  "price": 40,
  "stock": 20
}
```

Response: igual a crear producto.

### Eliminar producto

**DELETE** `/api/products/:id`

Response:

```json
{
  "raw": [],
  "affected": 1
}
```

---

## Archivos (`/api/files`)

Carga y sirve imágenes de productos.

### Subir imagen de producto

**POST** `/api/files/product`

Request: Form-data, campo `file` (imagen png/jpg/jpeg/gif)

Response:

```json
{
  "secureUrl": "http://localhost:3000/api/files/product/100042301_0_2000.jpg"
}
```

### Obtener imagen de producto

**GET** `/api/files/product/:imageName`

Response: Devuelve la imagen (binario).

---

## Auth (`/api/auth`)

Autenticación y gestión de usuarios.

### Registro de usuario

**POST** `/api/auth/signup`

Request:

```json
{
  "email": "usuario@correo.com",
  "password": "123456",
  "fullName": "Usuario Demo"
}
```

Response:

```json
{
  "id": "uuid",
  "email": "usuario@correo.com",
  "fullName": "Usuario Demo",
  "roles": ["user"],
  "token": "jwt-token"
}
```

### Login de usuario

**POST** `/api/auth/signin`

Request:

```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```

Response: igual a registro.

### Verificar autenticación

**GET** `/api/auth/check-status`

Headers: `Authorization: Bearer <token>`

Response:

```json
{
  "id": "uuid",
  "email": "usuario@correo.com",
  "fullName": "Usuario Demo",
  "roles": ["user"]
}
```

---

## Seed (`/api/seed`)

Inicializa la base de datos con datos de ejemplo.

### Ejecutar seed

**POST** `/api/seed`

Response:

```json
"Database seeded successfully"
```

---

## Notas Técnicas

- Usa NestJS, TypeORM y PostgreSQL.
- Validación de datos con DTOs y class-validator.
- Las imágenes se almacenan en `/static/products`.
- El endpoint `/api/files/product` solo acepta imágenes (`png`, `jpg`, `jpeg`, `gif`).
- Paginación disponible en productos.
- El seed elimina todos los productos antes de insertar los de ejemplo.
