const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');
// Importamos tu guardia de seguridad
const authMiddleware = require('../middleware/AuthMiddleware.js');

// Endpoint para CREAR un vehículo (Protegido con authMiddleware)
router.post('/vehiculos', authMiddleware, (req, res) => {
    const vehiculo = req.body;

    // Basado en los campos de tu tabla "vehiculos"
    const sql = `INSERT INTO vehiculos 
                (marca, modelo, anio, precio, estado_disponibilidad, image_url) 
                VALUES (?, ?, ?, ?, ?, ?)`;

    const valores = [
        vehiculo.marca, 
        vehiculo.modelo, 
        vehiculo.anio, 
        vehiculo.precio, 
        vehiculo.estado_disponibilidad || 'disponible', // Por defecto será 'disponible' si no envían nada
        vehiculo.image_url || null
    ];

    pool.query(sql, valores, (err, results) => {
        if(err){
            return res.status(500).json({status:500, message:"Ocurrió un error al registrar el vehículo", error: err});
        } else {
            vehiculo.id = results.insertId;
            return res.status(201).json({status:201, message:"Vehículo registrado exitosamente", data: vehiculo});
        }
    });
});

// Endpoint para LEER todo el inventario (Protegido con authMiddleware)
router.get('/vehiculos', authMiddleware, (req, res) => {
    const sql = 'SELECT * FROM vehiculos';

    pool.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({status:500, message:"Error al obtener los vehículos", error: err});
        }
        return res.status(200).json({status:200, message:"Inventario recuperado exitosamente", data: results});
    });
});

module.exports = router;