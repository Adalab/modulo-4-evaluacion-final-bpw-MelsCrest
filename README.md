# Evaluación final Melisa Cresta

Este ejercicio consiste en el desarrollo de una API de gestión de información *restaurantes y usuarios*. Este forma parte de la evaluación final del **Módulo 4: Express JS y bases de datos** de Adalab, donde se evaluan los conocimientos adquiridos durante este módulo.

## Tecnologías
Las tecnologías utilizadas para la realización de este ejercicio han sido:
- Express.js
- Node.js
- Bases de datos MySQL

## Documentación de la API de Restaurantes y Usuarios
### Introducción
Esta API permite gestionar información sobre restaurantes y usuarios. Proporciona funcionalidades como el registro de nuevos usuarios, inicio de sesión, y la gestión de restaurantes (crear, leer, actualizar y eliminar - CRUD).

**Autenticación**
La API utiliza *JWT (JSON Web Tokens)* para la autenticación. Para acceder a las rutas protegidas es necesario obtener un token de autenticación mediante el inicio de sesión de un usuario.

**Obtener un Token**
Realiza una petición POST a */login* proporcionando el email y password del usuario.

- Body (JSON):
~~~
{
  "email": "usuario@example.com",
  "password": "contraseña"
}
~~~

- Respuesta (200 OK):
~~~
{
  "success": true,
  "token": "JWT_TOKEN_AQUÍ"
}
~~~

- Respuesta (400 Bad Request):
~~~
{
  "success": false,
  "message": "Contraseña incorrecta"
}
~~~

**Endpoints**
1. Registrar un Usuario
Se realiza una petición POST a */registro* proporcionando el email, nombre y password del usuario.

- Body (JSON):
~~~
{
  "email": "nuevo_usuario@example.com",
  "nombre": "Juan Pérez",
  "password": "contraseñaSegura"
}
~~~

- Respuesta (201 Created):
~~~
{
  "success": true,
  "id": 1
}
~~~

- Respuesta (400 Bad Request):
~~~
{
  "success": false,
  "error": "Error. El usuario ya existe"
}
~~~

2. Obtener Todos los Restaurantes
Se realiza una petición GET a */restaurants*.

- Respuesta (200 OK):
~~~
{
  "result": [
    {
      "idrestaurant": 1,
      "name": "Restaurante A",
      "cousine_style": "Italiana",
      "area": "Centro",
      "price_range": "$$$",
      "fk_areas": 1,
      "fk_cousine_style": 2
    },
    {
      "idrestaurant": 2,
      "name": "Restaurante B",
      "cousine_style": "Mexicana",
      "area": "Norte",
      "price_range": "$$",
      "fk_areas": 2,
      "fk_cousine_style": 3
    }
  ]
}
~~~

- Respuesta (404 Not Found):
~~~
{
  "success": false,
  "message": "No se han encontrado restaurantes"
}
~~~

3. Crear un Restaurante
Se realiza una petición POST a */restaurants* proporcionando el nombre, estilo de cocina, zona, precio, y claves foráneas relacionadas con el restaurante y se añaden los datos correspondientes.
~~~
{
  "name": "Nuevo Restaurante",
  "cousine_style": "Japonesa",
  "area": "Sur",
  "price_range": "$$$",
  "fk_areas": 3,
  "fk_cousine_style": 4
}
~~~

- Respuesta (201 Created):
~~~
{
  "success": true,
  "id": 3
}
~~~

- Respuesta (400 Bad Request):
~~~
{
  "success": false,
  "message": "No se ha podido guardar el restaurante"
}
~~~

4. Actualizar un Restaurante
Se realiza una petición PUT a */restaurants* y se pasa por url params el *id* del restaurante a actualizar, por parámetros en el *body* se proporciona el nombre, estilo de cocina, zona, precio, y claves foráneas relacionadas con el restaurante y se modifican los datos a cambiar.
~~~
PUT /restaurants/{id}
~~~

- Body (JSON)
~~~
{
  "name": "Restaurante Actualizado",
  "cousine_style": "Francesa",
  "area": "Este",
  "price_range": "$$$",
  "fk_areas": 2,
  "fk_cousine_style": 5
}
~~~

- Respuesta (200 OK):
~~~
{
  "success": true
}
~~~

- Respuesta (400 Bad Request):
~~~
{
  "success": false,
  "message": "No se ha podido actualizar el restaurante"
}
~~~

5. Eliminar un Restaurante
Se realiza una petición DELETE a */restaurants* y se pasa por url params el *id* del restaurante a eliminar.
~~~
DELETE /restaurants/{id}
~~~

- Respuesta (200 OK):
~~~
{
  "success": true
}
~~~

- Respuesta (400 Bad Request):
~~~
{
  "success": false,
  "message": "No se ha podido eliminar el restaurante"
}
~~~

6. Obtener los Detalles del Usuario Autenticado
Se realiza una petición GET a */usuario* proporcionando el *token* desde *authorization*.
- Respuesta (200 OK):
~~~
{
  "success": true,
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan Pérez"
  }
}
~~~

- Respuesta (401 Unauthorized):
~~~
{
  "error": "Token no proporcionado"
}
~~~

**Respuestas de Error Comunes**
- 400 Bad Request: Petición incorrecta, normalmente por un problema con el cuerpo de la solicitud (por ejemplo, datos inválidos).
- 401 Unauthorized: El token de autenticación no fue proporcionado o es inválido.
- 404 Not Found: El recurso solicitado no fue encontrado.
- 500 Internal Server Error: Error interno del servidor, generalmente por fallos en la base de datos o problemas del servidor.

**Autenticación**
Las rutas que requieren autenticación (por ejemplo, /usuario), se debe incluir el token JWT obtenido durante el proceso de inicio de sesión en el encabezado de la solicitud como *authorization*.

**Ejemplo Completo con Postman**
Obtener el token:

- Método: POST
URL: http://localhost:3000/login
Body (JSON):
~~~
{
  "email": "usuario@example.com",
  "password": "contraseña"
}
~~~
Respuesta: Un objeto JSON con el token JWT.
Obtener detalles del usuario autenticado:

- Método: GET
URL: http://localhost:3000/usuario
Headers:
Authorization: Bearer JWT_TOKEN_AQUÍ
Respuesta: Detalles del usuario autenticado.
Conclusión
Esta es la estructura básica para interactuar con la API de restaurantes y usuarios. Los métodos POST, PUT, DELETE, y GET permiten crear, actualizar, eliminar y consultar los recursos de la API. Asegúrate de incluir el token JWT en las rutas protegidas.