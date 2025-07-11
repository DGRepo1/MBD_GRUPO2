const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const { connect } = require('../db/connection');
const { listarAbogados } = require('../controllers/abogado.controller');
const { asignarCaso } = require('../controllers/asignacion.controller');


// Ruta para obtener todos los abogados (para ADMIN)
router.get('/abogados', async (req, res) => {
  try {
    const conn = await connect();
    const result = await conn.execute(
      `BEGIN :cursor := SP_LISTAR_ABOGADOS(); END;`,
      {
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      }
    );

    const cursor = result.outBinds.cursor;
    const rows = await cursor.getRows();
    await cursor.close();
    await conn.close();

    const abogados = rows.map(row => ({
      idAbogado: row[0],
      nombre: row[1]
    }));

    res.json(abogados);
  } catch (err) {
    console.error("❌ Error en obtener abogados:", err);
    res.status(500).json({ message: 'Error al obtener abogados' });
  }
});

router.get('/abogados', listarAbogados);
router.post('/asignar', asignarCaso);

module.exports = router;
