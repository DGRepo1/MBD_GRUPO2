const express = require('express');
const router = express.Router();
const {
  asignarCaso,
  listarAsignaciones,
  eliminarAsignacion
} = require('../controllers/asignacion.controller');

router.post('/asignaciones', asignarCaso);
router.get('/asignaciones', listarAsignaciones);
router.delete('/asignaciones/:id', eliminarAsignacion);

module.exports = router;
