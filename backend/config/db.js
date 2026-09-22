const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


pool.getConnection((error, conexion) => {
    if (error) {
        console.error('Error de conexión con la base de datos:', error.message);
    } else {
        console.log('Conexión exitosa a la base de datos MySQL');
        conexion.release(); 
    }
});

module.exports = pool;