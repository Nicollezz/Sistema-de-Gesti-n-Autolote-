const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const verificarToken = require('../middleware/AuthMiddleware');

// Listar ventas
router.get('/', verificarToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ventas');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas', error });
    }
});

// Registrar una nueva venta
router.post('/', verificarToken, async (req, res) => {
    const { id_vehiculo, id_cliente, id_vendedor, precio_total, impuestos_aplicados } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO ventas (id_vehiculo, id_cliente, id_vendedor, precio_total, impuestos_aplicados) VALUES (?, ?, ?, ?, ?)',
            [id_vehiculo, id_cliente, id_vendedor, precio_total, impuestos_aplicados]
        );
        res.status(201).json({ message: 'Venta registrada con éxito', id_venta: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la venta', error });
    }
});

module.exports = router;