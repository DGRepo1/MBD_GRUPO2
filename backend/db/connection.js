const oracledb = require('oracledb');
require('dotenv').config();

async function connect() {
  try {
    return await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION
    });
  } catch (error) {
    console.error("Error conectando a Oracle:", error);
    throw error;
  }
}

module.exports = { connect };
