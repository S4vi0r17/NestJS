<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Pokédex API NestJS

API REST para la gestión de Pokémons, construida con [NestJS](https://nestjs.com/) y [MongoDB](https://www.mongodb.com/). Permite operaciones CRUD sobre una colección de Pokémons y la carga masiva desde la PokéAPI.

---

## Características principales

- CRUD completo de Pokémons (`/api/v2/pokemons`)
- Paginación en consultas
- Validaciones robustas con DTOs y pipes personalizados
- Adaptador HTTP para consumo externo de APIs
- Endpoint de semilla para poblar la base de datos desde PokéAPI
- Uso de Mongoose para modelado de datos
- Docker Compose para base de datos MongoDB

---

## Instalación y ejecución

Sigue estos pasos en orden para poner en marcha el proyecto:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/S4vi0r17/NestJS.git
   cd NestJS/03-pokedex
   ```
2. **Instala Nest CLI (si no lo tienes):**
   ```bash
   npm i -g @nestjs/cli
   ```
3. **Instala las dependencias:**
   ```bash
   yarn install
   # o
   npm install
   ```
4. **Crea un archivo `.env` basado en `.env.example`:**
   Asegúrate de copiar el archivo `.env.example` y renómbralo como `.env`. Las variables de entorno serán validadas utilizando Joi para garantizar su correcta configuración.
5. **Arranca la base de datos MongoDB con Docker:**
   ```bash
   docker-compose up -d
   ```
   Esto levantará un contenedor de MongoDB accesible en `mongodb://localhost:27017/nest-pokemon`.
6. **Inicia el servidor de desarrollo NestJS:**
   ```bash
   yarn start:dev
   # o
   npm run start:dev
   ```
7. **(Opcional) Rellena la base de datos con la semilla:**
   - Abre en tu navegador: [http://localhost:3000/api/v2/seed](http://localhost:3000/api/v2/seed)
   - Esto descargará y almacenará los primeros 650 Pokémons desde la PokéAPI.

---

## Despliegue y build de producción

Sigue estos pasos para construir y ejecutar la aplicación en modo producción usando Docker:

1. **Construye la imagen de producción:**
   ```bash
   docker build -t pokedex-nestjs:prod -f Dockerfile .
   ```
   - **Parámetros:**
     - `-t pokedex-nestjs:prod`: Asigna la etiqueta `pokedex-nestjs:prod` a la imagen.
     - `-f Dockerfile`: Usa el archivo `Dockerfile` para la construcción.
     - `.`: Contexto de build (directorio actual).
2. **(Opcional) Usa Docker Compose para producción:**
   Usaremos el archivo de variables de entorno `env.prod` para la configuración de producción.
   Si deseas levantar tanto la base de datos como la app en modo producción:
   ```bash
   docker-compose -f docker-compose.prod.yaml --env-file env.prod up -d --build
   ```
3. **Variables de entorno:**
   Asegúrate de tener el archivo `.env` o `env.prod` correctamente configurado antes de construir la imagen.
4. **Acceso a la API:**
   La API estará disponible en [http://localhost:3000/api/v2](http://localhost:3000/api/v2) por defecto.

Para más detalles revisa los archivos `Dockerfile`, `docker-compose.yml` y `docker-compose.prod.yaml`.

---

## Endpoints principales

- **GET `/api/v2/pokemons`**: Lista Pokémons (soporta paginación: `limit`, `offset`)
- **GET `/api/v2/pokemons/:term`**: Busca por nombre, número o id
- **POST `/api/v2/pokemons`**: Crea un nuevo Pokémon
- **PATCH `/api/v2/pokemons/:term`**: Actualiza un Pokémon por nombre, número o id
- **DELETE `/api/v2/pokemons/:id`**: Elimina un Pokémon por id
- **GET `/api/v2/seed`**: Pobla la base de datos con datos de PokéAPI

---

## Estructura y componentes relevantes

- **Adaptador HTTP**: `AxiosAdapter` en `src/common/adapters/axios.adapter.ts` para consumo externo de APIs.
- **Pipe personalizado**: `ParseMongoIdPipe` en `src/common/pipes/parse-mongo-id.pipe.ts` para validar IDs de MongoDB.
- **DTOs**: Validan y transforman datos de entrada (`src/pokemons/dto/`).
- **Entidad Pokémon**: Definición del modelo en `src/pokemons/entities/pokemon.entity.ts`.
- **Módulo de semilla**: Permite poblar la base de datos desde PokéAPI (`src/seed/`).

---

## Stack usado

- NestJS
- MongoDB
- Mongoose
- Docker (para base de datos)
- Axios
- class-validator / class-transformer

---

## Notas adicionales

- El prefijo global de la API es `/api/v2`.
- La base de datos por defecto es `nest-pokemon` (ver `docker-compose.yml`).
- Puedes consultar la guía `docker.md` para dudas sobre Docker y MongoDB.

---

## Ejemplo de petición para crear un Pokémon

```json
POST /api/v2/pokemons
{
  "name": "bulbasaur",
  "number": 1
}
```

---

> Proyecto educativo para practicar NestJS, MongoDB y buenas prácticas de APIs REST.
