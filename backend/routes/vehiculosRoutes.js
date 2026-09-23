const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. LISTAR todos los vehículos (GET)
router.get('/api/vehiculos', (req, res) => {
    const query = 'SELECT * FROM vehiculos';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los vehículos' });
        }
        res.json(results);
    });
});

// 2. CREAR un vehículo (POST)
router.post('/api/vehiculos', (req, res) => {
    const { marca, modelo, anio, precio, estado_disponibilidad } = req.body;
    const query = 'INSERT INTO vehiculos (marca, modelo, anio, precio, estado_disponibilidad) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [marca, modelo, anio, precio, estado_disponibilidad], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al registrar el vehículo' });
        }
        res.status(201).json({ message: 'Vehículo creado exitosamente', id: results.insertId });
    });
});

// 3. ACTUALIZAR un vehículo (PUT)
router.put('/api/vehiculos/:id', (req, res) => {
    const { id } = req.params;
    const { marca, modelo, anio, precio, estado_disponibilidad } = req.body;
    const query = 'UPDATE vehiculos SET marca = ?, modelo = ?, anio = ?, precio = ?, estado_disponibilidad = ? WHERE id = ?';

    db.query(query, [marca, modelo, anio, precio, estado_disponibilidad, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el vehículo' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Vehículo no encontrado' });
        }
        res.json({ message: 'Vehículo actualizado correctamente' });
    });
});

// 4. ELIMINAR un vehículo (DELETE)
router.delete('/api/vehiculos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM vehiculos WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el vehículo' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Vehículo no encontrado' });
        }
        res.json({ message: 'Vehículo eliminado correctamente' });
    });
});

module.exports = router;