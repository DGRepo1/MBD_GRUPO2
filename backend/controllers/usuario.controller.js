const { connect } = require('../db/connection');
const oracledb = require('oracledb');


async function loginUsuario(req, res) {
  const { correo, contrasena } = req.body;

  try {
    const conn = await connect();
    const result = await conn.execute(
      `BEGIN SP_LOGIN_USER(:correo, :contrasena, :cursor); END;`,
      {
        correo,
        contrasena,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();
    await conn.close();

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const [idUsuario, nombre, rol] = rows[0];
    console.log("🧾 Usuario desde la base:", rows[0]); // ✅ corregido
    res.json({ id: idUsuario, nombre, rol });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en login' });
  }
}

module.exports = { loginUsuario };
