const mongoose = require('mongoose');
const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    precio: {
        type: Number,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    }
});

const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;