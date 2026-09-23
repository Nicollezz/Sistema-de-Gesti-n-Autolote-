const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const pool = require('../config/db.js');

require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Ruta para iniciar sesión (POST)
router.post('/login', (req, res) => {
    const user = req.body;
    
    // Buscamos al usuario por su correo
    const sql = "SELECT id, nombre, correo, contrasena FROM usuarios WHERE correo = ?";

    pool.query(sql, [user.correo], async (err, results) => {
        if(err){
            return res.status(500).json({status:500, message:"Ocurrió un error en la consulta"});
        }

        if(results.length === 0){
            return res.status(401).json({status:401, message:"Credenciales inválidas"});
        }

        let cUser = results[0];
        
        // Comparamos la contraseña enviada con la encriptada en la base de datos
        const isMatch = await bcrypt.compare(user.contrasena, cUser.contrasena);

        if(!isMatch){
            return res.status(401).json({status:401, message:"Credenciales inválidas"});
        }

        // Generamos el token JWT si la contraseña es correcta
        const token = jwt.sign({id: cUser.id, correo: cUser.correo, nombre: cUser.nombre}, JWT_SECRET_KEY, {expiresIn:'8h'});

        return res.status(200).json({status:200, message:"Login exitoso", data: token});
    });
});

// Endpoint para REGISTRAR un nuevo usuario con contraseña encriptada
router.post('/registro', async (req, res) => {
    // 1. Ahora extraemos también el nombre
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ status: 400, message: "El nombre, correo y contraseña son obligatorios" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

        const sql = 'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)';
        
        // 2. Agregamos el nombre al arreglo de variables que se envían a MySQL
        pool.query(sql, [nombre, correo, contrasenaEncriptada], (err, results) => {
            // ... resto de tu código (no cambia)
            if (err) {
                // Validación útil: si intentan registrar un correo que ya existe
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ status: 409, message: "Este correo ya está registrado" });
                }
                return res.status(500).json({ status: 500, message: "Error al registrar el usuario", error: err });
            }

            return res.status(201).json({ status: 201, message: "Usuario registrado exitosamente" });
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Error interno del servidor", error: error.message });
    }
});

module.exports = router;