const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const pool = require('../config/db.js');

// Ruta para registrar usuario (POST)
router.post('/registro', async (req, res) => {
    const usuario = req.body;
    
    // Query adaptado a tu script SQL del Autolote
    const sql = "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)";


    const saltRound = 10;
    const hash = await bcrypt.hash(usuario.contrasena, saltRound);

    pool.query(sql, [usuario.nombre, usuario.correo, hash], (err, results) => {
        if(err){
            return res.status(500).json({status:500, message:"Ocurrió un error al registrar", error: err});
        } else {
            return res.status(200).json({status:200, message:"Usuario registrado exitosamente"});
        }
    });
});

module.exports = router;