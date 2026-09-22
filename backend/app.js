require('dotenv').config(); 

const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');
const cors = require('cors'); 

const app = express();

const AuthRoute = require('./routes/AuthRoute.js');
const UsuariosRoutes = require('./routes/UsuariosRoute.js');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());



app.get('/gethash/:plaintext', async (req, res) => {
    try {
        const plaintext = req.params.plaintext;
        const saltRound = 10;
        const hash = await bcrypt.hash(plaintext, saltRound);
        res.send(hash);
    } catch (error) {
        res.status(500).json({ error: 'Error al generar el hash' });
    }
});


app.get('/api/divisas', async (req, res) => {
    try {
       
        let url = process.env.ENDPOINT_API_TERCEROS; 
        console.log(url);

        const responseAxios = await axios.get(url);
        let tasas = responseAxios.data;

        return res.status(200).json({ status: 200, message: 'Success', data: tasas });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Ocurrió un error inesperado, inténtelo más tarde...' });
    }
});

const vehiculosRoutes = require('./routes/vehiculosRoutes');
app.use('/', vehiculosRoutes);

const clientesRoutes = require('./routes/clientesRoutes');
const consultasClientesRoutes = require('./routes/consultasClientesRoutes');
const ventasRoutes = require('./routes/ventasRoutes');

app.use('/', clientesRoutes);
app.use('/', consultasClientesRoutes);
app.use('/', ventasRoutes);
app.use('/', AuthRoute);
app.use('/', UsuariosRoutes);


app.listen(PORT, () => {
    console.log(`El servidor está escuchando en: http://localhost:${PORT}`);
});