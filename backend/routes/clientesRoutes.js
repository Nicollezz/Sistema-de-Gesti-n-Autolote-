const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verificarToken = require('../middleware/AuthMiddleware');
// 1. Obtener todos los clientes
router.get('/', verificarToken, (req, res) => {
    const query = 'SELECT * FROM clientes';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los clientes' });
        res.json(results);
    });
});

// 2. Registrar un nuevo cliente
router.post('/', verificarToken, (req, res) => {
    const { nombre, apellido, correo, telefono, direccion } = req.body;
    const query = 'INSERT INTO clientes (nombre, apellido, correo, telefono, direccion) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [nombre, apellido, correo, telefono, direccion], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al registrar el cliente' });
        res.status(201).json({ message: 'Cliente registrado exitosamente', id: result.insertId });
    });
});

// 3. Eliminar cliente
router.delete('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clientes WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el cliente' });
        res.json({ message: 'Cliente eliminado correctamente' });
    });
});

// 4. Obtener el historial de consultas de un cliente específico
router.get('/:id/consultas', verificarToken, (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM consultas_clientes WHERE cliente_id = ? ORDER BY fecha DESC';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener las consultas' });
        res.json(results);
    });
});

// 5. Registrar una nueva consulta / prueba de manejo para un cliente
router.post('/:id/consultas', verificarToken, (req, res) => {
    const { id } = req.params;
    const { mensaje } = req.body;
    const query = 'INSERT INTO consultas_clientes (cliente_id, mensaje) VALUES (?, ?)';
    
    db.query(query, [id, mensaje], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al registrar la consulta' });
        res.status(201).json({ message: 'Consulta registrada exitosamente' });
    });
});

module.exports = router;