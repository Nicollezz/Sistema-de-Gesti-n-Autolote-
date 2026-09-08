const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const PORT = 3000;


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Oapj_1804.',
    database: 'Autolote_db'
});



app.use(express.json());




app.listen(PORT, () => {
    console.log(`El sevidor esta escuchando en: http://localhost:${PORT}`);
});