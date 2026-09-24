const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verificarToken = require('../middleware/AuthMiddleware');

// Obtener todos los vehículos
router.get('/', verificarToken, (req, res) => {
  const query = 'SELECT * FROM vehiculos ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener vehículos:', err);
      return res.status(500).json({ error: 'Error en el servidor al obtener los vehículos' });
    }
    res.json(results);
  });
});

// Registrar un nuevo vehículo
router.post('/', verificarToken, (req, res) => {
  const { marca, modelo, anio, precio, estado_disponibilidad, image_url } = req.body;

  
  if (!marca || !modelo || !anio || !precio) {
    return res.status(400).json({ error: 'Los campos marca, modelo, anio y precio son obligatorios.' });
  }

  const query = `
    INSERT INTO vehiculos (marca, modelo, anio, precio, estado_disponibilidad, image_url) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    marca.trim(), 
    modelo.trim(), 
    Number(anio), 
    Number(precio), 
    estado_disponibilidad || 'disponible', 
    image_url ? image_url.trim() : null
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al registrar vehículo en MySQL:', err);
      return res.status(500).json({ error: 'Error al registrar el vehículo en la base de datos', detalle: err.message });
    }
    res.status(201).json({ 
      message: 'Vehículo registrado con éxito', 
      id: result.insertId 
    });
  });
});

// Eliminar un vehículo
router.delete('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM vehiculos WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar vehículo:', err);
      return res.status(500).json({ error: 'Error al eliminar el vehículo' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'El vehículo no fue encontrado.' });
    }

    res.json({ message: 'Vehículo eliminado con éxito' });
  });
});

module.exports = router;