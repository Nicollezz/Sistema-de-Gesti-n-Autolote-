const express = require('express');
const router = express.Router();
const axios = require('axios');
const verificarToken = require('../middleware/AuthMiddleware');

// Endpoint para obtener las tasas de cambio
router.get('/', verificarToken, async (req, res) => {
    try {
        // Ejemplo usando ExchangeRate-API (reemplaza tu API Key o usa un endpoint público)
        const apiKey = process.env.API_KEY_DIVISAS || 'tu_api_key';
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

        const response = await axios.get(url);
        
        // Retornamos las tasas de cambio al frontend
        res.json({
            status: 200,
            message: 'Tasas de cambio obtenidas con éxito',
            data: response.data.conversion_rates // Objeto con las monedas (EUR, HNL, MXN, etc.)
        });
    } catch (error) {
        console.error('Error al consumir API externa:', error);
        res.status(500).json({ error: 'No se pudo obtener las tasas de cambio de la API externa' });
    }
});

module.exports = router;