const express = require('express');
const router = express.Router();
const axios = require('axios');
const verificarToken = require('../middleware/AuthMiddleware');


router.get('/', verificarToken, async (req, res) => {
    try {
        
        const apiKey = process.env.API_KEY_DIVISAS || 'tu_api_key';
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

        const response = await axios.get(url);
        
  
        res.json({
            status: 200,
            message: 'Tasas de cambio obtenidas con éxito',
            data: response.data.conversion_rates 
        });
    } catch (error) {
        console.error('Error al consumir API externa:', error);
        res.status(500).json({ error: 'No se pudo obtener las tasas de cambio de la API externa' });
    }
});

module.exports = router;