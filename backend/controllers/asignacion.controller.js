const { connect } = require('../db/connection');
const oracledb = require('oracledb');


async function asignarCaso(req, res) {
  const { idCasoLegal, idAbogado } = req.body;

  try {
    const conn = await connect();
    await conn.execute(
      `BEGIN SP_ASIGNAR_CASO(:caso, :abogado); END;`,
      {
        caso: parseInt(idCasoLegal),
        abogado: parseInt(idAbogado)
      }
    );
    await conn.close();
    res.json({ mensaje: 'Caso asignado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

async function listarAsignaciones(req, res) {
  try {
    const conn = await connect();
    const result = await conn.execute(
      `BEGIN :cursor := SP_LISTAR_ASIGNACIONES; END;`,
      {
        cursor: { type: require('oracledb').CURSOR, dir: require('oracledb').BIND_OUT }
      }
    );
    const rs = result.outBinds.cursor;
    const rows = await rs.getRows();
    await rs.close();
    await conn.close();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar asignaciones' });
  }
}

async function eliminarAsignacion(req, res) {
  const { id } = req.params;
  try {
    const conn = await connect();
    await conn.execute(
      `BEGIN SP_ELIMINAR_ASIGNACION(:idAsignacion); END;`,
      { idAsignacion: parseInt(id) }
    );
    await conn.close();
    res.json({ mensaje: 'Asignación eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar asignación' });
  }
}

module.exports = {
  asignarCaso,
  listarAsignaciones,
  eliminarAsignacion
};
