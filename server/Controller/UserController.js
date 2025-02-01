
const User = require('../models/User');

// Función para registrar un usuario
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Exportamos la función para que pueda ser usada en `userRoutes.js`
module.exports = { registerUser };
