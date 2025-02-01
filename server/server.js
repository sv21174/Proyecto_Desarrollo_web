// server/server.js - Configuración del servidor con Express y MongoDB
const express = require('express');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
const connectDB = require('./config/db');
connectDB();

// Importar rutas
const userRoutes = require('./Routes/userRoutes.js');
const productroutes = require('./Routes/productroutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productroutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


