const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Iniciar servidor
const app = express();

// Establecer la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'proyectoFinal/FemmeECommerce')));

// Ruta
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'proyectoFinal/FemmeECommerce') });
});

// Puerto
const port = 3002; 
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});