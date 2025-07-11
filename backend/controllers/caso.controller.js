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

async function listarCasos(req, res) {
  try {
    const conn = await connect();
    const result = await conn.execute(
      `BEGIN :cursor := SP_LISTAR_CASOS(); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );
    const rs = result.outBinds.cursor;
    const rows = await rs.getRows();
    await rs.close();
    await conn.close();

    const casos = rows.map(c => ({
      idCaso: c[0],
      nombreCaso: c[1],
      fecha: c[2],
      nombreCliente: c[3],
      asignado: false // si deseas puedes actualizar este valor luego
    }));

    res.json(casos);
  } catch (err) {
    console.error('❌ Error en listarCasos (admin):', err);
    res.status(500).json({ error: 'Error al obtener casos (admin)' });
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

async function crearCaso(req, res) {
  const { nombre, descripcion, idCliente } = req.body;

  try {
    const conn = await connect();

    await conn.execute(
      `INSERT INTO CasoLegal (idCaso, FechaRegistro, NombreCaso, DescripcionCaso, IdCliente)
       VALUES (SEQ_CASOLEGAL.NEXTVAL, SYSDATE, :nombre, :descripcion, :idCliente)`,
      [nombre, descripcion, idCliente]
    );

    await conn.close();
    res.json({ mensaje: 'Caso registrado correctamente' });
  } catch (err) {
    console.error('❌ Error al registrar caso:', err);
    res.status(500).json({ error: 'Error al registrar caso' });
  }
}

async function eliminarCaso(req, res) {
  const { id } = req.params;

  try {
    const conn = await connect();
    await conn.execute(`DELETE FROM CasoLegal WHERE idCaso = :id`, [parseInt(id)]);
    await conn.close();

    res.json({ mensaje: 'Caso eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar caso:', err);
    res.status(500).json({ error: 'Error al eliminar caso' });
  }
}
async function obtenerCasosPorAbogado(req, res) {
  const { idAbogado } = req.params;
  try {
    const conn = await connect();
    const result = await conn.execute(
      `SELECT c.idCasoLegal, c.nombre, c.estado, c.fechaRegistro, cl.nombreCliente AS cliente
       FROM CasoLegal c
       JOIN Cliente cl ON c.idCliente = cl.idCliente
       JOIN Asignacion a ON a.idCasoLegal = c.idCasoLegal
       WHERE a.idAbogado = :id`,
      [idAbogado],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await conn.close();
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener casos por abogado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}




module.exports = {
  obtenerCasosPorAbogado,
  obtenerComentariosPorCaso,
  agregarComentario,
  listarCasos,
  crearCaso,
  eliminarCaso,
  obtenerCasosPorAbogado
};
