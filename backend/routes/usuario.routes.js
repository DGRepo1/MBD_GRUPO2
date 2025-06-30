const express = require('express');
const router = express.Router();
const { loginUsuario } = require('../controllers/usuario.controller');

router.post('/login', loginUsuario);

module.exports = router;
