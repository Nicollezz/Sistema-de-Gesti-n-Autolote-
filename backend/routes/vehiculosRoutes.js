const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verificarToken = require('../middleware/AuthMiddleware');

// 1. Listar y Filtrar Vehículos (GET /api/vehiculos)
router.get('/', verificarToken, (req, res) => {
    let query = 'SELECT * FROM vehiculos WHERE 1=1';
    let params = [];

    const { marca, modelo, estado } = req.query;

    if (marca) {
        query += ' AND marca LIKE ?';
        params.push(`%${marca}%`);
    }
    if (modelo) {
        query += ' AND modelo LIKE ?';
        params.push(`%${modelo}%`);
    }
    if (estado) {
        query += ' AND estado_disponibilidad = ?';
        params.push(estado);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los vehículos' });
        res.json(results);
    });
});

// 2. Registrar Vehículo (POST /api/vehiculos)
router.post('/', verificarToken, (req, res) => {
    const { marca, modelo, anio, precio, estado_disponibilidad, imagen_url } = req.body;
    const query = 'INSERT INTO vehiculos (marca, modelo, anio, precio, estado_disponibilidad, imagen_url) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [marca, modelo, anio, precio, estado_disponibilidad, imagen_url], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al registrar el vehículo' });
        res.status(201).json({ message: 'Vehículo registrado exitosamente', id: result.insertId });
    });
});

// 3. Modificar Vehículo (PUT /api/vehiculos/:id)
router.put('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { marca, modelo, anio, precio, estado_disponibilidad, imagen_url } = req.body;
    const query = 'UPDATE vehiculos SET marca = ?, modelo = ?, anio = ?, precio = ?, estado_disponibilidad = ?, imagen_url = ? WHERE id = ?';

    db.query(query, [marca, modelo, anio, precio, estado_disponibilidad, imagen_url, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el vehículo' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Vehículo no encontrado' });
        res.json({ message: 'Vehículo actualizado exitosamente' });
    });
});

// 4. Eliminar Vehículo (DELETE /api/vehiculos/:id)
router.delete('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM vehiculos WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el vehículo' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Vehículo no encontrado' });
        res.json({ message: 'Vehículo eliminado exitosamente' });
    });
});

module.exports = router;