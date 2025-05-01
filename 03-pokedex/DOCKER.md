# Notas y Apuntes de la Configuración Docker

Este proyecto utiliza Docker para facilitar el despliegue y la gestión de entornos de desarrollo y producción. A continuación se describen los archivos y comandos principales relacionados con Docker en este repositorio.

---

## 1. Dockerfile

- Define la imagen base y los pasos para construir la aplicación NestJS.
- Instala dependencias, copia el código fuente y expone el puerto necesario.
- Suele usarse para producción, generando una imagen optimizada.

## 2. Dockerfile-simple

- Variante simplificada del Dockerfile principal.
- Útil para pruebas rápidas o entornos de desarrollo menos estrictos.
- Puede omitir optimizaciones o pasos de seguridad presentes en el Dockerfile principal.

## 3. docker-compose.yml

- Archivo de configuración para levantar servicios en desarrollo.
- Orquesta contenedores como la app de NestJS y la base de datos MongoDB.
- Usa variables de entorno del archivo `.env` por defecto.
- Ejemplo de uso:
  ```bash
  docker-compose up --build
  ```
  - `up`: Levanta los servicios definidos.
  - `--build`: Fuerza la reconstrucción de las imágenes.

## 4. docker-compose.prod.yaml

- Archivo de configuración para el entorno de producción.
- Suele usar variables de entorno de un archivo específico (ej: `.env.prod`).
- Puede incluir configuraciones adicionales de seguridad, volúmenes persistentes, etc.
- Ejemplo de uso:
  ```bash
  docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
  ```
  - `-f`: Especifica el archivo de configuración.
  - `--env-file`: Indica el archivo de variables de entorno a usar.

---

## Comandos Útiles

- **Construir y levantar en producción:**
  ```bash
  docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
  ```
- **Levantar en producción (sin reconstruir):**
  ```bash
  docker-compose -f docker-compose.prod.yaml --env-file .env.prod up
  ```
- **Levantar en desarrollo:**
  ```bash
  docker-compose up --build
  ```
- **Nota:** Si tienes el archivo `.env` configurado para producción, puedes omitir `--env-file .env.prod`:
  ```bash
  docker-compose -f docker-compose.prod.yaml up --build
  ```

---

## Notas sobre archivos `.env`

Este proyecto utiliza archivos `.env` para gestionar variables de entorno en diferentes entornos (desarrollo, producción, ejemplo/base). A continuación se describen los archivos y su formato:

### 1. `.env.example`

- Archivo de ejemplo para referencia y configuración inicial.
- Formato:
  ```env
  PORT=3000
  MONGODB_URI=mongodb://localhost:27017
  MONGODB_DB_NAME=nest-pokedex
  DEFAULT_LIMIT=6
  ```
- Úsalo como plantilla para crear tu propio `.env` de desarrollo.

### 2. `.env.prod`

- Archivo de variables de entorno para producción.
- Formato:
  ```env
  PORT=3000
  # DOCKER: nombre del contenedor de mongo
  MONGODB_URI=mongodb://mongo-poke:27017
  MONGODB_DB_NAME=nest-pokedex
  DEFAULT_LIMIT=6
  ```
- Nota: El valor de `MONGODB_URI` apunta al contenedor de MongoDB definido en Docker Compose para producción.

### 3. `.env` (deberías crearlo para desarrollo)

- No existe por defecto, pero puedes crearlo a partir de `.env.example`.
- Formato sugerido:
  ```env
  PORT=3000
  MONGODB_URI=mongodb://localhost:27017
  MONGODB_DB_NAME=nest-pokedex
  DEFAULT_LIMIT=6
  ```
- Este archivo es ignorado por git y se usa localmente.

#### Referencias útiles

- [Documentación oficial de dotenv (npm)](https://www.npmjs.com/package/dotenv)
- [12factor.net/config](https://12factor.net/config)

**Recomendación:**

- No subas archivos `.env` con datos sensibles a repositorios públicos.
- Mantén separados los archivos de entorno para desarrollo y producción.
- Usa `.env.example` como referencia para nuevos colaboradores.

---

## Recursos y Referencias

- [Gist de referencia con ejemplos y buenas prácticas Docker para NestJS](https://gist.github.com/Klerith/e7861738c93712840ab3a38674843490)

---

## Consejos

- Mantén separados los archivos de configuración para desarrollo y producción.
- Usa archivos `.env` distintos para cada entorno.
- Consulta el gist enlazado para ejemplos avanzados y recomendaciones de seguridad.

---

# Versión anterior del README

> El contenido anterior se ha mejorado y extendido para mayor claridad y utilidad. Si necesitas detalles adicionales sobre algún archivo o comando, revisa la documentación oficial de Docker y Docker Compose.
