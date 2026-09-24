const express = require('express');
const router = express.Router();

const db = require('../config/db');

// 1. Obtener todos los clientes
router.get('/', (req, res) => {
    const query = 'SELECT * FROM clientes';
    db.query(query, (err, resultados) => {
        if (err) {
            console.error('Error al obtener clientes:', err);
            return res.status(500).json({ error: 'Error al obtener clientes' });
        }
        res.json(resultados);
    });
});

// 2. Registrar un nuevo cliente
router.post('/', (req, res) => {
    const { nombre, apellido, correo, telefono, direccion } = req.body;

    const query = 'INSERT INTO clientes (nombre, apellido, correo, telefono, direccion) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [nombre, apellido, correo, telefono, direccion], (err, resultado) => {
        if (err) {
            console.error('Error al guardar en MySQL:', err);
            return res.status(500).json({ error: 'No se pudo guardar el cliente' });
        }
        res.json({ message: 'Cliente guardado con éxito', id: resultado.insertId });
    });
});

module.exports = router;