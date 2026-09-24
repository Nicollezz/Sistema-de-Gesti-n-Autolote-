const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const vehiculosRoutes = require('./routes/vehiculosRoutes'); 
const divisaRoutes = require('./routes/divisaRoutes');      
const clientesRoutes = require('./routes/clientesRoutes');
const ventasRoutes = require('./routes/ventasRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/divisas', divisaRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ventas', ventasRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});