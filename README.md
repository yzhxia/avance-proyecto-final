# Sistema de Inventario

Hice un sistema de inventario enfocado en productos como audífonos, celulares y laptops. La idea principal es que sea una aplicación que deje administrar los productos de una manera sencilla, pudiendo agregarlos, consultarlos, modificarlos y eliminarlos.

## Cosas que usé para este trabajo

- **HTML:** para crear la estructura de las páginas.
- **CSS:** para darle estilo al sistema.
- **JavaScript:** para agregar las funciones e interactuar con el servidor.
- **Node.js y Express:** para crear y ejecutar el servidor y las rutas de la aplicación.
- **MongoDB:** para guardar la información de los usuarios y productos.
- **Mongoose:** para conectar el proyecto con la base de datos.
- **JWT y bcryptjs:** para manejar el inicio de sesión y proteger las contraseñas.

## Estructura del proyecto

- `server.js`: contiene el servidor, las rutas de la API, el inicio de sesión y las operaciones del inventario.
- `models/`: contiene los modelos de usuario y producto.
- `public/`: contiene las páginas HTML, los estilos CSS y el JavaScript del frontend.
- `.env`: contiene la configuración del proyecto, como la conexión a MongoDB y la clave para los tokens.

## Cómo ejecutar el proyecto

1. Tener Node.js y MongoDB instalados y en funcionamiento.
2. Descargar o clonar el repositorio.
3. Crear un archivo `.env` en la carpeta principal con la configuración necesaria:
   - `PORT=3000`
   - `MONGODB_URI=mongodb://localhost:27017/avance_proyecto`
   - `JWT_SECRET=tu_clave_secreta`
   - `JWT_EXPIRES_IN=2h`
4. Abrir una terminal en la carpeta del proyecto y ejecutar `npm install`.
5. Iniciar el servidor con `npm start`.
6. Abrir `http://localhost:3000` en el navegador.

## API

| Método | Ruta | Requiere token | Función |
|---|---|---|---|
| POST | `/api/login` | No | Permite iniciar sesión y obtener un token. |
| GET | `/api/productos` | No | Muestra todos los productos. |
| GET | `/api/productos/:id` | No | Consulta un producto por su ID. |
| POST | `/api/productos` | Sí | Agrega un producto nuevo. |
| PUT | `/api/productos/:id` | Sí | Actualiza la información de un producto. |
| DELETE | `/api/productos/:id` | Sí | Elimina un producto. |
