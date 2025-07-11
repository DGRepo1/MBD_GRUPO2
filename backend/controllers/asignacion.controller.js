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
    console.error("❌ Error al asignar caso:", err);

    if (err.message.includes('ORA-20001')) {
      return res.status(400).json({
        error: 'Este caso ya fue asignado a este abogado.'
      });
    }

    res.status(500).json({
      error: 'Error inesperado al asignar el caso'
    });
  }
}


async function listarAsignaciones(req, res) {
  try {
    const conn = await connect();
    const result = await conn.execute(
      `BEGIN :cursor := SP_LISTAR_ASIGNACIONES(); END;`,
      {
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      }
    );

    const cursor = result.outBinds.cursor;
    const rows = await cursor.getRows();
    await cursor.close();
    await conn.close();

    const asignaciones = rows.map(row => ({
      idAsignacion: row[0],
      fecha: row[1],
      cliente: row[2],
      caso: row[3],
      especialidad: row[4],
      abogado: row[5]
    }));

    res.json(asignaciones);

  } catch (error) {
    console.error("❌ Error en listarAsignaciones:", error);
    res.status(500).json({ message: 'Error al listar asignaciones' });
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
