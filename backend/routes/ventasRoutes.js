const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - Obtener todas las ventas
router.get('/api/ventas', (req, res) => {
    const sql = `
        SELECT
            ve.id,
            ve.fecha_venta,
            ve.vehiculo_id,
            CONCAT(v.marca, ' ', v.modelo, ' ', v.anio) AS vehiculo,
            ve.cliente_id,
            CONCAT(c.nombre, ' ', c.apellido) AS cliente,
            ve.vendedor_id,
            u.nombre AS vendedor,
            ve.precio_total,
            ve.impuestos_aplicados
        FROM ventas ve
        INNER JOIN vehiculos v ON ve.vehiculo_id = v.id
        INNER JOIN clientes c ON ve.cliente_id = c.id
        INNER JOIN usuarios u ON ve.vendedor_id = u.id
        ORDER BY ve.id DESC
    `;

    pool.query(sql, (error, resultados) => {
        if (error) {
            console.error('Error al obtener ventas:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error al obtener las ventas'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Ventas obtenidas correctamente',
            data: resultados
        });
    });
});

// GET - Obtener una venta por ID
router.get('/api/ventas/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            ve.id,
            ve.fecha_venta,
            ve.vehiculo_id,
            CONCAT(v.marca, ' ', v.modelo, ' ', v.anio) AS vehiculo,
            ve.cliente_id,
            CONCAT(c.nombre, ' ', c.apellido) AS cliente,
            ve.vendedor_id,
            u.nombre AS vendedor,
            ve.precio_total,
            ve.impuestos_aplicados
        FROM ventas ve
        INNER JOIN vehiculos v ON ve.vehiculo_id = v.id
        INNER JOIN clientes c ON ve.cliente_id = c.id
        INNER JOIN usuarios u ON ve.vendedor_id = u.id
        WHERE ve.id = ?
    `;

    pool.query(sql, [id], (error, resultados) => {
        if (error) {
            console.error('Error al obtener venta:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error al obtener la venta'
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Venta no encontrada'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Venta obtenida correctamente',
            data: resultados[0]
        });
    });
});

// POST - Registrar venta con transacción
router.post('/api/ventas', async (req, res) => {
    const {
        vehiculo_id,
        cliente_id,
        vendedor_id,
        precio_total,
        impuestos_aplicados
    } = req.body;

    if (
        !vehiculo_id ||
        !cliente_id ||
        !vendedor_id ||
        precio_total === undefined ||
        impuestos_aplicados === undefined
    ) {
        return res.status(400).json({
            status: 400,
            message: 'Vehículo, cliente, vendedor, precio total e impuestos son obligatorios'
        });
    }

    const connection = await pool.promise().getConnection();

    try {
        // Iniciar transacción
        await connection.beginTransaction();

        // Bloquear el vehículo durante la transacción
        const [vehiculos] = await connection.execute(
            `
            SELECT id, precio, estado_disponibilidad
            FROM vehiculos
            WHERE id = ?
            FOR UPDATE
            `,
            [vehiculo_id]
        );

        if (vehiculos.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                status: 404,
                message: 'El vehículo no existe'
            });
        }

        const vehiculo = vehiculos[0];

        if (vehiculo.estado_disponibilidad !== 'disponible') {
            await connection.rollback();

            return res.status(409).json({
                status: 409,
                message: 'El vehículo no está disponible para la venta',
                estado_actual: vehiculo.estado_disponibilidad
            });
        }

        // Verificar cliente
        const [clientes] = await connection.execute(
            'SELECT id FROM clientes WHERE id = ?',
            [cliente_id]
        );

        if (clientes.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                status: 404,
                message: 'El cliente no existe'
            });
        }

        // Verificar vendedor
        const [vendedores] = await connection.execute(
            'SELECT id FROM usuarios WHERE id = ?',
            [vendedor_id]
        );

        if (vendedores.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                status: 404,
                message: 'El vendedor no existe'
            });
        }

        // Registrar la venta
        const [venta] = await connection.execute(
            `
            INSERT INTO ventas
            (
                vehiculo_id,
                cliente_id,
                vendedor_id,
                precio_total,
                impuestos_aplicados
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                vehiculo_id,
                cliente_id,
                vendedor_id,
                precio_total,
                impuestos_aplicados
            ]
        );

        // Cambiar estado del vehículo
        await connection.execute(
            `
            UPDATE vehiculos
            SET estado_disponibilidad = 'vendido'
            WHERE id = ?
            `,
            [vehiculo_id]
        );

        // Confirmar toda la operación
        await connection.commit();

        res.status(201).json({
            status: 201,
            message: 'Venta registrada correctamente',
            data: {
                venta_id: venta.insertId,
                vehiculo_id,
                cliente_id,
                vendedor_id,
                precio_total,
                impuestos_aplicados,
                estado_vehiculo: 'vendido'
            }
        });

    } catch (error) {
        // Revertir cualquier cambio si ocurre un error
        await connection.rollback();

        console.error('Error en la transacción de venta:', error);

        res.status(500).json({
            status: 500,
            message: 'No fue posible registrar la venta. La operación fue revertida.'
        });

    } finally {
        connection.release();
    }
});

module.exports = router;