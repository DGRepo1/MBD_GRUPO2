const { connect } = require('../db/connection');
const oracledb = require('oracledb');


async function loginUsuario(req, res) {
  const { correo, contrasena } = req.body;

  try {
    const conn = await connect();
    const result = await conn.execute(
      `BEGIN :cursor := SP_LOGIN_USER(:correo, :contrasena); END;`,
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

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const [user] = rows;
    res.json({
      id: user.IDUSUARIO,
      nombre: user.NOMBRE,
      rol: user.ROL
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en login' });
  }
}

module.exports = { loginUsuario };
