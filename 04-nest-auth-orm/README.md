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
