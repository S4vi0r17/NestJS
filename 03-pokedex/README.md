# Guía de Docker Compose para MongoDB en este proyecto

---

## 1. ¿Qué significa `version: '3.8'`?

La línea `version: '3.8'` en el archivo `docker-compose.yml` indica la versión del formato de archivo que Docker Compose usará para interpretar el archivo.  
**En versiones modernas de Docker Compose, esta línea es opcional y puede eliminarse**; Docker detecta automáticamente la versión adecuada.

---

## ¿Por qué a veces no se crea la base de datos inicial?

La variable `MONGO_INITDB_DATABASE` **solo crea la base de datos si también defines un usuario inicial** usando `MONGO_INITDB_ROOT_USERNAME` y `MONGO_INITDB_ROOT_PASSWORD` (o `MONGO_INITDB_USERNAME` y `MONGO_INITDB_PASSWORD`).

- Si no defines un usuario, MongoDB arranca sin crear la base de datos; la base se crea automáticamente **cuando insertas el primer dato**.
- Si defines usuario y contraseña, la base de datos indicada en `MONGO_INITDB_DATABASE` se crea al iniciar el contenedor.

**Resumen:**
- La base de datos aparece cuando insertas datos o si creas un usuario inicial.
- La variable sola no la crea visible al arrancar.

---

## 2. ¿Qué representa el nombre `mongo` bajo `services:`?

El nombre `mongo` es el identificador lógico del servicio de MongoDB dentro de Docker Compose.  
Sirve para:
- Referenciar el contenedor desde otros servicios (por ejemplo, para dependencias).
- Identificar el contenedor en comandos y logs.

---

## 3. ¿Qué poner en `environment:` y por qué?

La sección `environment:` define variables de entorno que el contenedor usará al iniciar.  
Para MongoDB, lo más común es establecer el usuario, contraseña y base de datos inicial:

```yaml
environment:
  MONGO_INITDB_ROOT_USERNAME: admin
  MONGO_INITDB_ROOT_PASSWORD: admin123
  MONGO_INITDB_DATABASE: pokedex
```

- `MONGO_INITDB_ROOT_USERNAME` y `MONGO_INITDB_ROOT_PASSWORD`: crean un usuario administrador.
- `MONGO_INITDB_DATABASE`: crea una base de datos inicial al arrancar el contenedor.

> **Nota:** La variable correcta es `MONGO_INITDB_DATABASE`, no `MONGODB_DATABASE`.

---

## 4. ¿Qué hace la opción `restart:`?

La opción `restart: always` le indica a Docker que reinicie automáticamente el contenedor si se detiene inesperadamente (por error o reinicio del sistema), excepto si lo detienes manualmente.

---

## 5. ¿Para qué sirve la sección `volumes:`?

La sección `volumes:` sirve para **persistir los datos** generados por el contenedor, incluso si el contenedor se elimina o reinicia.  
Ejemplo:

```yaml
volumes:
  - mongo_data:/data/db
```

Esto guarda los datos de MongoDB en un volumen llamado `mongo_data` en tu máquina, evitando la pérdida de información.

---

## 6. Diferencia entre `mongo_data:/data/db` y `./mongo_data:/data/db`

- `mongo_data:/data/db`:  
  Usa un **named volume** administrado por Docker. Es más aislado, portable y recomendado para producción. Docker gestiona la ubicación del volumen.
- `./mongo_data:/data/db`:  
  Usa una **carpeta local** de tu máquina (bind mount). Es útil para desarrollo porque puedes ver y editar los archivos directamente desde tu sistema operativo.

**No es necesario usar ambos a la vez; elige uno según tus necesidades.**

---

## 7. ¿Para qué sirve el bloque `volumes:` al final del archivo?

El bloque `volumes:` al final del archivo `docker-compose.yml` declara los **named volumes** que usas en los servicios.  
Ejemplo:

```yaml
volumes:
  mongo_data:
```

- Si usas `mongo_data:/data/db` en tu servicio, Docker buscará este volumen declarado.
- Si usas solo rutas locales (`./mongo_data:/data/db`), este bloque no es necesario.
- Declarar los volúmenes explícitamente es buena práctica para mayor claridad y portabilidad.

---

## 8. ¿Es obligatorio el nombre `mongo_data`?

No, puedes usar cualquier nombre de volumen.  
Solo asegúrate de ser consistente en el archivo: el nombre debe coincidir en la sección del servicio y en la declaración al final.

---

## 9. Solución a error de conexión con Docker

Si ves un error como:

```
unable to get image 'mongo:5': error during connect: ... open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

Significa que Docker Desktop no está corriendo.  
**Solución:**
- Abre Docker Desktop y espera a que esté en estado "running".
- Luego ejecuta de nuevo `docker compose up -d`.

---

## 10. ¿Qué versión poner en Docker Compose?

No es necesario especificar la versión (`version:`) en archivos modernos.  
Puedes eliminar esa línea y Docker Compose detectará la versión adecuada automáticamente.

---

## 11. Resumen visual de un archivo `docker-compose.yml` típico para MongoDB

```yaml
services:
  mongo:
    image: mongo:5
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
      MONGO_INITDB_DATABASE: pokedex
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

- Para desarrollo, puedes cambiar `mongo_data:/data/db` por `./mongo_data:/data/db` si prefieres ver los archivos en tu sistema.
- El bloque `volumes:` al final solo es necesario si usas named volumes.

---

> Si tienes dudas sobre cómo adaptar tu archivo `docker-compose.yml` para MongoDB, consulta esta guía o revisa la [documentación oficial de Docker Compose](https://docs.docker.com/compose/compose-file/).

