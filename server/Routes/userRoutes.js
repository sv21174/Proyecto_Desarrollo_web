

const express = require('express');
const Router = express.Router();
const User = require('../Models/user');

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
