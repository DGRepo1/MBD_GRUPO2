const express = require('express');
const router = express.Router();
const {
  obtenerCasosPorAbogado,
  obtenerComentariosPorCaso,
  agregarComentario,
  listarCasos,
  crearCaso,
  eliminarCaso,
  obtenerCasosPorAbogado
} = require('../controllers/caso.controller');

router.get('/casos/:idAbogado', obtenerCasosPorAbogado);
router.get('/casos/:idCaso/seguimiento', obtenerComentariosPorCaso);
router.post('/casos/:idCaso/seguimiento', agregarComentario);
router.get('/casos', listarCasos);
router.post('/', crearCaso);
router.delete('/:id', eliminarCaso);
router.get('/casos/:idAbogado', obtenerCasosPorAbogado);

module.exports = router;
