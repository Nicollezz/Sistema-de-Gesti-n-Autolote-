const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/db');

//  Importar tus rutas
const UsuariosRoutes = require('./src/routes/UsuariosRouts.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use('/api', UsuariosRoutes);

app.listen(PORT, () => {
    console.log(`El servidor del Autolote está escuchando en: http://localhost:${PORT}`);
});