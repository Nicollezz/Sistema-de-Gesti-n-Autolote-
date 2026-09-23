const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario
router.post('/register', async (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const query = 'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)';
        db.query(query, [nombre, correo, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al registrar usuario en la base de datos' });
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Inicio de sesión
router.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;
    const query = 'SELECT * FROM usuarios WHERE correo = ?';
    
    db.query(query, [correo], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

        const usuario = results[0];
        const match = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

        const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, process.env.JWT_SECRET || 'clave_secreta', { expiresIn: '2h' });
        res.json({ message: 'Inicio de sesión exitoso', token });
    });
});

module.exports = router;