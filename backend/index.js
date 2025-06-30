const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuario.routes');
const casoRoutes = require('./routes/caso.routes');
const asignacionRoutes = require('./routes/asignacion.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', usuarioRoutes);
app.use('/api', casoRoutes);
app.use('/api', asignacionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor backend en http://localhost:${PORT}`);
});
