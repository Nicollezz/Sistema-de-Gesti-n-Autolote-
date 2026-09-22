const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - Obtener todos los clientes
router.get('/api/clientes', (req, res) => {
    const sql = `
        SELECT 
            id,
            nombre,
            apellido,
            correo_electronico,
            telefono,
            direccion,
            created_at
        FROM clientes
        ORDER BY id DESC
    `;

    pool.query(sql, (error, resultados) => {
        if (error) {
            console.error('Error al obtener clientes:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error al obtener los clientes'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Clientes obtenidos correctamente',
            data: resultados
        });
    });
});

// GET - Obtener un cliente por ID
router.get('/api/clientes/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 
            id,
            nombre,
            apellido,
            correo_electronico,
            telefono,
            direccion,
            created_at
        FROM clientes
        WHERE id = ?
    `;

    pool.query(sql, [id], (error, resultados) => {
        if (error) {
            console.error('Error al obtener el cliente:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error al obtener el cliente'
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Cliente no encontrado'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Cliente obtenido correctamente',
            data: resultados[0]
        });
    });
});

// POST - Crear cliente
router.post('/api/clientes', (req, res) => {
    const {
        nombre,
        apellido,
        correo_electronico,
        telefono,
        direccion
    } = req.body;

    if (!nombre || !apellido || !correo_electronico) {
        return res.status(400).json({
            status: 400,
            message: 'Nombre, apellido y correo electrónico son obligatorios'
        });
    }

    const sql = `
        INSERT INTO clientes
        (nombre, apellido, correo_electronico, telefono, direccion)
        VALUES (?, ?, ?, ?, ?)
    `;

    pool.query(
        sql,
        [nombre, apellido, correo_electronico, telefono || null, direccion || null],
        (error, resultado) => {
            if (error) {
                console.error('Error al crear cliente:', error);

                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        status: 409,
                        message: 'El correo electrónico ya está registrado'
                    });
                }

                return res.status(500).json({
                    status: 500,
                    message: 'Error al crear el cliente'
                });
            }

            res.status(201).json({
                status: 201,
                message: 'Cliente creado correctamente',
                data: {
                    id: resultado.insertId,
                    nombre,
                    apellido,
                    correo_electronico,
                    telefono: telefono || null,
                    direccion: direccion || null
                }
            });
        }
    );
});

// PUT - Actualizar cliente
router.put('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre,
        apellido,
        correo_electronico,
        telefono,
        direccion
    } = req.body;

    if (!nombre || !apellido || !correo_electronico) {
        return res.status(400).json({
            status: 400,
            message: 'Nombre, apellido y correo electrónico son obligatorios'
        });
    }

    const sql = `
        UPDATE clientes
        SET
            nombre = ?,
            apellido = ?,
            correo_electronico = ?,
            telefono = ?,
            direccion = ?
        WHERE id = ?
    `;

    pool.query(
        sql,
        [
            nombre,
            apellido,
            correo_electronico,
            telefono || null,
            direccion || null,
            id
        ],
        (error, resultado) => {
            if (error) {
                console.error('Error al actualizar cliente:', error);

                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        status: 409,
                        message: 'El correo electrónico ya está registrado'
                    });
                }

                return res.status(500).json({
                    status: 500,
                    message: 'Error al actualizar el cliente'
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    status: 404,
                    message: 'Cliente no encontrado'
                });
            }

            res.status(200).json({
                status: 200,
                message: 'Cliente actualizado correctamente'
            });
        }
    );
});

// DELETE - Eliminar cliente
router.delete('/api/clientes/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM clientes WHERE id = ?';

    pool.query(sql, [id], (error, resultado) => {
        if (error) {
            console.error('Error al eliminar cliente:', error);

            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    status: 409,
                    message: 'No se puede eliminar el cliente porque tiene registros relacionados'
                });
            }

            return res.status(500).json({
                status: 500,
                message: 'Error al eliminar el cliente'
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Cliente no encontrado'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Cliente eliminado correctamente'
        });
    });
});

module.exports = router;