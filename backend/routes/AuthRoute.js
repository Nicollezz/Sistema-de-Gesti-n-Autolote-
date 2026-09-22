const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js'); 

router.post('/login', async (req, res) => {
    try {
        const { Username, Password } = req.body;

        return res.status(200).json({
            status: 200,
            message: 'Inicio de sesión exitoso',
             
        });

    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ 
            status: 500, 
            message: 'Ocurrió un error inesperado en el servidor' 
        });
    }
});

module.exports = router;