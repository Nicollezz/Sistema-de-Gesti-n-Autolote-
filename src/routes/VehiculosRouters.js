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

// Endpoint para ACTUALIZAR
router.put('/vehiculos/:id', authMiddleware, (req, res) => {
    // Extraemos el ID de la URL
    const { id } = req.params;
    // Extraemos los nuevos datos del Body
    const vehiculo = req.body;

    // Sentencia SQL para actualizar los campos
    const sql = `UPDATE vehiculos 
                 SET marca = ?, modelo = ?, anio = ?, precio = ?, estado_disponibilidad = ?, image_url = ? 
                 WHERE id = ?`;

    const valores = [
        vehiculo.marca, 
        vehiculo.modelo, 
        vehiculo.anio, 
        vehiculo.precio, 
        vehiculo.estado_disponibilidad, 
        vehiculo.image_url || null, 
        id
    ];

    pool.query(sql, valores, (err, results) => {
        if(err){
            return res.status(500).json({status: 500, message: "Error al actualizar el vehículo", error: err});
        }
        
        // Verificamos si el vehículo con ese ID realmente existe en la base de datos
        if(results.affectedRows === 0){
            return res.status(404).json({status: 404, message: "Vehículo no encontrado"});
        }

        return res.status(200).json({status: 200, message: "Vehículo actualizado exitosamente"});
    });
});

// Endpoint para ELIMINAR
router.delete('/vehiculos/:id', authMiddleware, (req, res) => {
    // Extraemos el ID de la URL
    const { id } = req.params;

    // Sentencia SQL para eliminar el registro
    const sql = 'DELETE FROM vehiculos WHERE id = ?';

    pool.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({status: 500, message: "Error al eliminar el vehículo", error: err});
        }
        
        // Verificamos si el vehículo existía antes de intentar borrarlo
        if(results.affectedRows === 0){
            return res.status(404).json({status: 404, message: "Vehículo no encontrado"});
        }

        return res.status(200).json({status: 200, message: "Vehículo eliminado exitosamente"});
    });
});
module.exports = router; 