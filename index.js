const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/db');

// Importar rutas
const UsuariosRoutes = require('./src/routes/UsuariosRouts.js');
const AuthRoute = require('./src/routes/AuthRoute.js'); 
const VehiculosRoutes = require('./src/routes/vehiculosRouters.js');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Usar rutas
app.use('/api', UsuariosRoutes);
app.use('/api', AuthRoute); 
app.use('/api', VehiculosRoutes);

app.listen(PORT, () => {
    console.log(`El servidor del Autolote está escuchando en: http://localhost:${PORT}`);
});