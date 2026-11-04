require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('./models/usuario');
const Producto = require('./models/producto');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Faltan datos' });
        }
        const usuarioExiste = await Usuario.findOne({ username });
        if (usuarioExiste) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }
        const passwordEncriptada = await bcrypt.hash(password, 10);
        const usuario = await Usuario.create({
            username,
            password: passwordEncriptada
        });
        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            id: usuario._id
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const usuario = await Usuario.findOne({ username });
        if (!usuario) {
            return res.status(401).json({
                error: 'Usuario o contraseña incorrectos'
            });
        }
        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );
        if (!passwordCorrecta) {
            return res.status(401).json({
                error: 'Usuario o contraseña incorrectos'
            });
        }
        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.json({
            mensaje: 'Inicio de sesion correcto',
            token: token
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al iniciar sesion'
        });
    }
});

function verificarToken(req, res, next) {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalido' });
    }
    
}

function validarProducto(req, res, next) {
    const { nombre, precio, cantidad } = req.body;
    if (!nombre || typeof nombre !== 'string') {
        return res.status(400).json({
            error: 'El nombre del producto es obligatorio'
        });
    }
    if (precio === undefined || typeof precio !== 'number' || precio < 0) {
        return res.status(400).json({
            error: 'El precio debe ser un numero valido'
        });
    }
    if (!Number.isInteger(cantidad) || cantidad < 0) {
        return res.status(400).json({
            error: 'La cantidad debe ser un numero entero valido'
        });
    }
    next();
}

app.post('/api/productos', verificarToken, validarProducto, async (req, res) => {
    try {
        const producto = await Producto.create(req.body);
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ error: 'No se pudo crear el producto' });
    }
});

app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar productos' });
    }
});

app.get('/api/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        res.status(400).json({ error: 'ID no valido' });
    }
});

app.put('/api/productos/:id', verificarToken, validarProducto, async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(400).json({ error: 'No se pudo actualizar el producto' });
    }
});

app.delete('/api/productos/:id', verificarToken, async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ error: 'No se pudo eliminar el producto' });
    }
});

app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).json({
        error: 'Ocurrio un error interno en el servidor'
    });
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error de conexion:', error);
    });