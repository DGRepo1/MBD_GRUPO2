const { connect } = require('../db/connection');

async function obtenerClientes(req, res) {
  try {
    const conn = await connect();
    const result = await conn.execute(`SELECT IdCliente, NombreCliente FROM Cliente`);
    
    const clientes = result.rows.map(row => ({
      idCliente: row[0],
      nombre: row[1],
    }));
    
    await conn.close();
    res.json(clientes);
  } catch (error) {
    console.error('❌ Error en obtenerClientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
}

module.exports = { obtenerClientes };


// backend/controllers/cliente.controller.js