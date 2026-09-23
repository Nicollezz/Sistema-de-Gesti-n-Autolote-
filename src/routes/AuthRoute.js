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

module.exports = router;