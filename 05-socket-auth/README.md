# NestJS + MongoDB + Prisma

Esta guía cubre la integración de MongoDB con Prisma y NestJS, incluyendo configuración, comandos útiles y ejemplos de uso.

---

## 1. Configuración de MongoDB con Docker

Agrega este servicio en tu `docker-compose.yml`:

```yaml
services:
  mongo:
    image: mongo:5
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: ${MONGODB_DB_NAME}
    volumes:
      - ./mongo_data:/data/db
```

Inicia MongoDB:

```sh
docker-compose up -d
```

---

## 2. Variables de entorno

En tu archivo `.env`:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/socket-auth-db
MONGODB_DB_NAME=socket-auth-db
JWT_SECRET=supersecretkey
```

---

## 3. Configuración de Prisma para MongoDB

En `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("MONGODB_URI")
}
```

Ejemplo de modelo de usuario:

```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  roles     String[] @default(["user"])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 4. Comandos Prisma para MongoDB

- **Generar el cliente Prisma:**
  ```sh
  yarn prisma generate
  ```
- **Sincronizar el esquema con la base de datos:**
  ```sh
  yarn prisma db push
  ```
  > **Nota:** No uses `prisma migrate dev` con MongoDB, solo `db push`.

---

## 5. Uso de Prisma Client en NestJS

Instala Prisma Client:
```sh
yarn add @prisma/client
```

Importa y usa el cliente en tus servicios:

```typescript
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaClient) {}
  // ...
}
```

---

## 6. Ejemplo de hash de contraseñas con bcrypt

Instala bcrypt:
```sh
yarn add bcrypt
```

Importa correctamente en TypeScript:
```typescript
import * as bcrypt from 'bcrypt';

const hashed = bcrypt.hashSync(password, 10);
```

---

## 7. Errores comunes y soluciones

- **No se puede conectar a `mongo:27017` desde local:**
  - Usa `localhost` en la URI si ejecutas Prisma desde tu máquina.
- **PrismaClientKnownRequestError: MongoDB necesita replica set:**
  - Algunas operaciones requieren que MongoDB esté en modo replica set. Para desarrollo, puedes iniciar MongoDB como replica set:
    ```sh
    docker run --name mongo-rs -p 27017:27017 -d mongo:5 --replSet rs0
    docker exec -it mongo-rs mongosh --eval "rs.initiate()"
    ```
    Y usa la URI: `mongodb://localhost:27017/socket-auth-db?replicaSet=rs0`
- **No usar `prisma migrate dev` con MongoDB:**
  - Usa siempre `prisma db push`.
- **Error con bcrypt:**
  - Importa con `import * as bcrypt from 'bcrypt';`

---

## 8. Recursos útiles

- [Documentación Prisma + MongoDB](https://www.prisma.io/docs/orm/prisma-client/working-with-mongodb)
- [NestJS + Prisma](https://docs.nestjs.com/recipes/prisma)
- [Prisma MongoDB Limitations](https://www.prisma.io/docs/orm/prisma-migrate/mongodb)

---

## 9. Ejemplo de DTO y uso en NestJS

`src/auth/dto/create-user.dto.ts`:
```typescript
export class CreateUserDto {
  email: string;
  password: string;
  roles?: string[];
}
```

`src/auth/auth.service.ts` (fragmento):
```typescript
import * as bcrypt from 'bcrypt';
// ...existing code...
async signup(createUserDto: CreateUserDto) {
  const { password, ...userData } = createUserDto;
  const hashedPassword = bcrypt.hashSync(password, 10);
  return this.prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });
}
```

---

## 10. Comandos útiles

- Iniciar MongoDB con Docker:
  ```sh
  docker-compose up -d
  ```
- Generar Prisma Client:
  ```sh
  yarn prisma generate
  ```
- Sincronizar esquema:
  ```sh
  yarn prisma db push
  ```
- Verificar estado de Prisma:
  ```sh
  yarn prisma studio
  ```

---

## 11. Notas finales

- Usa siempre `prisma db push` para MongoDB.
- Si necesitas transacciones, inicia MongoDB como replica set.
- Usa `import * as bcrypt from 'bcrypt'` para evitar errores de importación.
- Consulta la documentación oficial para detalles avanzados.

---

# Notas de configuración y solución de errores para MongoDB + Prisma + NestJS

---

## 1. ¿Por qué Prisma necesita Replica Set en MongoDB?
- Prisma requiere transacciones para algunas operaciones.
- MongoDB solo permite transacciones si está configurado como replica set (aunque sea de un solo nodo).
- Por eso, debes iniciar MongoDB con `--replSet rs0` y agregar `replicaSet=rs0` en la URL de conexión.

---

## 2. Configuración de MongoDB como Replica Set en Docker Compose

En tu `docker-compose.yml`:

```yaml
services:
  mongo:
    image: mongo:5
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: ${MONGODB_DB_NAME}
    command: ["--replSet", "rs0"]
    volumes:
      - ./mongo_data:/data/db
```

---

## 3. Inicializar el Replica Set

1. Inicia el contenedor:
   ```sh
   docker-compose up -d
   ```
2. Entra al contenedor:
   ```sh
   docker exec -it <nombre_del_contenedor_mongo> mongosh
   # Ejemplo: docker exec -it 05-socket-auth-mongo-1 mongosh
   ```
3. Ejecuta en el shell de MongoDB:
   ```js
   rs.initiate()
   ```

---

## 4. Solución al error de host interno en Replica Set

- Prisma puede fallar si el host del miembro del replica set es el nombre interno del contenedor (ej: `27337f055739:27017`).
- Debes cambiarlo a `localhost:27017` para que Prisma lo resuelva correctamente desde tu máquina.

### Pasos para cambiar el host del miembro:

1. Entra al shell de MongoDB:
   ```sh
   docker exec -it 05-socket-auth-mongo-1 mongosh
   ```
2. Ejecuta:
   ```js
   cfg = rs.conf()
   cfg.members[0].host = "localhost:27017"
   rs.reconfig(cfg, {force: true})
   rs.status() // Verifica que el host sea localhost:27017
   ```

---

## 5. Variables de entorno recomendadas

En tu archivo `.env`:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/socket-auth-db?replicaSet=rs0
MONGODB_DB_NAME=socket-auth-db
JWT_SECRET=supersecretkey
```

---

## 6. Comandos útiles

- Iniciar MongoDB con Docker:
  ```sh
  docker-compose up -d
  ```
- Inicializar replica set:
  ```sh
  docker exec -it 05-socket-auth-mongo-1 mongosh
  rs.initiate()
  ```
- Cambiar host del miembro:
  ```js
  cfg = rs.conf()
  cfg.members[0].host = "localhost:27017"
  rs.reconfig(cfg, {force: true})
  ```
- Generar Prisma Client:
  ```sh
  yarn prisma generate
  ```
- Sincronizar esquema:
  ```sh
  yarn prisma db push
  ```
- Verificar estado de Prisma:
  ```sh
  yarn prisma studio
  ```

---

## 7. Errores comunes y soluciones

- **PrismaClientKnownRequestError: MongoDB necesita replica set:**
  - Solución: Inicia MongoDB como replica set y usa la URI con `replicaSet=rs0`.
- **ReplicaSetNoPrimary o No available servers:**
  - Solución: Cambia el host del miembro del replica set a `localhost:27017`.
- **No usar `prisma migrate dev` con MongoDB:**
  - Usa siempre `prisma db push`.
- **Error con bcrypt:**
  - Importa con `import * as bcrypt from 'bcrypt';`

---

## 8. Recursos útiles

- [Documentación Prisma + MongoDB](https://www.prisma.io/docs/orm/prisma-client/working-with-mongodb)
- [NestJS + Prisma](https://docs.nestjs.com/recipes/prisma)
- [Prisma MongoDB Limitations](https://www.prisma.io/docs/orm/prisma-migrate/mongodb)

---

## 9. Ejemplo de DTO y uso en NestJS

`src/auth/dto/create-user.dto.ts`:
```typescript
export class CreateUserDto {
  email: string;
  password: string;
  roles?: string[];
}
```

`src/auth/auth.service.ts` (fragmento):
```typescript
import * as bcrypt from 'bcrypt';
// ...existing code...
async signup(createUserDto: CreateUserDto) {
  const { password, ...userData } = createUserDto;
  const hashedPassword = bcrypt.hashSync(password, 10);
  return this.prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });
}
```

---

## 10. Notas finales

- Usa siempre `prisma db push` para MongoDB.
- Si necesitas transacciones, inicia MongoDB como replica set.
- Cambia el host del miembro del replica set a `localhost:27017` si usas Docker en Windows.
- Usa `import * as bcrypt from 'bcrypt'` para evitar errores de importación.
- Consulta la documentación oficial para detalles avanzados.