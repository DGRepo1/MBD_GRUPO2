const { connect } = require('../db/connection');
const oracledb = require('oracledb');

async function obtenerCasosPorAbogado(req, res) {
  const { idAbogado } = req.params;
  try {
    const conn = await connect();
    const result = await conn.execute(
      `BEGIN :cursor := SP_CASOS_POR_ABOGADO(:id); END;`,
      {
        id: parseInt(idAbogado),
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );
    const rs = result.outBinds.cursor;
    const rows = await rs.getRows();
    await rs.close();
    await conn.close();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener casos' });
  }
}

async function obtenerComentariosPorCaso(req, res) {
  const { idCaso } = req.params;
  try {
    const conn = await connect();
    const result = await conn.execute(
      `BEGIN :cursor := SP_GET_COMENTARIOS(:idCaso); END;`,
      {
        idCaso: parseInt(idCaso),
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );
    const rs = result.outBinds.cursor;
    const rows = await rs.getRows();
    await rs.close();
    await conn.close();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
}

async function agregarComentario(req, res) {
  const { idCaso } = req.params;
  const { autor, comentario } = req.body;
  try {
    const conn = await connect();

    // obtener idUsuario desde nombre
    const user = await conn.execute(
      `SELECT idUsuario FROM Usuario WHERE Nombre = :nombre`,
      [autor]
    );
    if (user.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const idUsuario = user.rows[0][0];

    await conn.execute(
      `BEGIN SP_AGREGAR_COMENTARIO(:idCaso, :idUsuario, :texto); END;`,
      {
        idCaso: parseInt(idCaso),
        idUsuario,
        texto: comentario
      }
    );
    await conn.close();
    res.json({ mensaje: 'Comentario agregado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar comentario' });
  }
}

module.exports = {
  obtenerCasosPorAbogado,
  obtenerComentariosPorCaso,
  agregarComentario
};
