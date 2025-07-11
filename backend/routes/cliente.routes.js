const express = require('express');
const router = express.Router();
const { obtenerClientes} = require('../controllers/cliente.controller');

router.get('/', obtenerClientes);

module.exports = router;

// backend/routes/cliente.routes.js