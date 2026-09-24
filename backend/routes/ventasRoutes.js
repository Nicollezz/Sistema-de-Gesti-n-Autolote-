const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const verificarToken = require('../middleware/AuthMiddleware');

// Obtener el historial de ventas
router.get('/', verificarToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ventas');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ message: 'Error al obtener las ventas', error });
    }
});

// Registrar una nueva venta
router.post('/', verificarToken, async (req, res) => {
    try {
        const { cliente_id, vehiculo_id, precio_total, impuestos_aplicados } = req.body;

       
        const vendedor_id = req.user?.id || req.user?.userId || req.body.vendedor_id || 1;

        const query = `
            INSERT INTO ventas (cliente_id, vehiculo_id, vendedor_id, precio_total, impuestos_aplicados) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.query(query, [
            cliente_id, 
            vehiculo_id, 
            vendedor_id, 
            precio_total, 
            impuestos_aplicados
        ]);
        
        res.status(201).json({ message: 'Venta registrada con éxito', id: result.insertId });
    } catch (error) {
        console.error('Error al registrar venta:', error);
        res.status(500).json({ message: 'Error al registrar la venta', error });
    }
});

module.exports = router;