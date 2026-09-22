const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - Obtener todas las consultas
router.get('/api/consultas-clientes', (req, res) => {
    const sql = `
        SELECT
            cc.id,
            cc.cliente_id,
            CONCAT(c.nombre, ' ', c.apellido) AS cliente,
            cc.vehiculo_id,
            CONCAT(v.marca, ' ', v.modelo, ' ', v.anio) AS vehiculo,
            cc.mensaje,
            cc.estado,
            cc.created_at
        FROM consultas_clientes cc
        INNER JOIN clientes c ON cc.cliente_id = c.id
        INNER JOIN vehiculos v ON cc.vehiculo_id = v.id
        ORDER BY cc.id DESC
    `;

    pool.query(sql, (error, resultados) => {
        if (error) {
            console.error('Error al obtener consultas:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error al obtener las consultas'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Consultas obtenidas correctamente',
            data: resultados
        });
    });
});

// GET - Obtener consulta por ID
router.get('/api/consultas-clientes/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            cc.id,
            cc.cliente_id,
            CONCAT(c.nombre, ' ', c.apellido) AS cliente,
            cc.vehiculo_id,
            CONCAT(v.marca, ' ', v.modelo, ' ', v.anio) AS vehiculo,
            cc.mensaje,
            cc.estado,
            cc.created_at
        FROM consultas_clientes cc
        INNER JOIN clientes c ON cc.cliente_id = c.id
        INNER JOIN vehiculos v ON cc.vehiculo_id = v.id
        WHERE cc.id = ?
    `;

    pool.query(sql, [id], (error, resultados) => {
        if (error) {
            console.error('Error al obtener consulta:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error al obtener la consulta'
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Consulta no encontrada'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Consulta obtenida correctamente',
            data: resultados[0]
        });
    });
});

// POST - Registrar consulta
router.post('/api/consultas-clientes', (req, res) => {
    const {
        cliente_id,
        vehiculo_id,
        mensaje
    } = req.body;

    if (!cliente_id || !vehiculo_id || !mensaje) {
        return res.status(400).json({
            status: 400,
            message: 'Cliente, vehículo y mensaje son obligatorios'
        });
    }

    const sql = `
        INSERT INTO consultas_clientes
        (cliente_id, vehiculo_id, mensaje)
        VALUES (?, ?, ?)
    `;

    pool.query(
        sql,
        [cliente_id, vehiculo_id, mensaje],
        (error, resultado) => {
            if (error) {
                console.error('Error al registrar consulta:', error);

                if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(404).json({
                        status: 404,
                        message: 'El cliente o vehículo indicado no existe'
                    });
                }

                return res.status(500).json({
                    status: 500,
                    message: 'Error al registrar la consulta'
                });
            }

            res.status(201).json({
                status: 201,
                message: 'Consulta registrada correctamente',
                data: {
                    id: resultado.insertId,
                    cliente_id,
                    vehiculo_id,
                    mensaje,
                    estado: 'pendiente'
                }
            });
        }
    );
});

// PUT - Actualizar consulta
router.put('/api/consultas-clientes/:id', (req, res) => {
    const { id } = req.params;
    const {
        cliente_id,
        vehiculo_id,
        mensaje,
        estado
    } = req.body;

    if (!cliente_id || !vehiculo_id || !mensaje || !estado) {
        return res.status(400).json({
            status: 400,
            message: 'Cliente, vehículo, mensaje y estado son obligatorios'
        });
    }

    if (!['pendiente', 'atendido'].includes(estado)) {
        return res.status(400).json({
            status: 400,
            message: 'El estado debe ser pendiente o atendido'
        });
    }

    const sql = `
        UPDATE consultas_clientes
        SET
            cliente_id = ?,
            vehiculo_id = ?,
            mensaje = ?,
            estado = ?
        WHERE id = ?
    `;

    pool.query(
        sql,
        [cliente_id, vehiculo_id, mensaje, estado, id],
        (error, resultado) => {
            if (error) {
                console.error('Error al actualizar consulta:', error);

                if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(404).json({
                        status: 404,
                        message: 'El cliente o vehículo indicado no existe'
                    });
                }

                return res.status(500).json({
                    status: 500,
                    message: 'Error al actualizar la consulta'
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    status: 404,
                    message: 'Consulta no encontrada'
                });
            }

            res.status(200).json({
                status: 200,
                message: 'Consulta actualizada correctamente'
            });
        }
    );
});

// DELETE - Eliminar consulta
router.delete('/api/consultas-clientes/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM consultas_clientes WHERE id = ?';

    pool.query(sql, [id], (error, resultado) => {
        if (error) {
            console.error('Error al eliminar consulta:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error al eliminar la consulta'
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Consulta no encontrada'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Consulta eliminada correctamente'
        });
    });
});

module.exports = router;