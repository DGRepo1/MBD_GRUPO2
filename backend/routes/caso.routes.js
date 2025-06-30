const express = require('express');
const router = express.Router();
const {
  obtenerCasosPorAbogado,
  obtenerComentariosPorCaso,
  agregarComentario
} = require('../controllers/caso.controller');

router.get('/casos/:idAbogado', obtenerCasosPorAbogado);
router.get('/casos/:idCaso/seguimiento', obtenerComentariosPorCaso);
router.post('/casos/:idCaso/seguimiento', agregarComentario);

module.exports = router;
