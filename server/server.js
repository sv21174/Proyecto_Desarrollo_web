// server/server.js - Configuración del servidor con Express y MongoDB
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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
const productRoutes = require('./Routes/productroutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productroutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

/* ------------------------------ */

// server/config/db.js - Configuración de conexión a MongoDB
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB conectado');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

/* ------------------------------ */

// server/models/User.js - Modelo de usuario
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

/* ------------------------------ */

// server/models/Product.js - Modelo de producto
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);

/* ------------------------------ */

// server/routes/userRoutes.js - Rutas de usuarios
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;

/* ------------------------------ */

// server/routes/productRoutes.js - Rutas de productos
const express = require('express');
const Router = express.Router();
const Product = require('../Models/product');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
