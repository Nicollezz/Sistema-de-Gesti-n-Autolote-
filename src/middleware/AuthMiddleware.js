const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Verificamos si el usuario envió la cabecera de autorización
    if(!authHeader){
        return res.status(401).json({status: 401, message: "Acceso denegado, se requiere token"});
    }

    // El formato esperado es "Bearer <token>", aquí extraemos solo el texto del token
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({status: 401, message: "Acceso denegado, token malformado"});
    }

    // Comparamos el token con tu clave secreta
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(401).json({status: 401, message: "Token inválido o expirado"});
        }
        
        // Si es válido, extraemos los datos del usuario y lo dejamos pasar
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;