const { connect } = require('../db/connection');
const oracledb = require('oracledb');

async function listarAbogados(req, res) {
  try {
    const conn = await connect();
    const result = await conn.execute(
      `BEGIN :cursor := SP_LISTAR_ABOGADOS(); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );
    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();
    await conn.close();

    const abogados = rows.map(a => ({
      idAbogado: a[0],
      nombre: a[1]
    }));

    res.json(abogados);
  } catch (error) {
    console.error('❌ Error al listar abogados:', error);
    res.status(500).json({ message: 'Error al obtener abogados' });
  }
}

module.exports = { listarAbogados };
