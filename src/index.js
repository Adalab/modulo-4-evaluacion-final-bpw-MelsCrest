//IMPORTS 
const express = require("express");
const cors = require("cors");
const mysql = require('mysql2/promise');

//CREAR SERVIDOR 
const server = express();

//CONFIGURAR SERVIDOR 
server.use(cors());
server.use(express.json());

//PUERTO 
const PORT = 5001; 
server.listen(PORT, ()=>{
  console.log(`Servidor corriendo por http://localhost:${PORT}`);
});

//CONEXION A LA BASE DE DATOS MSQL2
// async function getConnection() {
//   const connection = await mysql.createConnection({
//     host: 'localhost',
//     database: '',
//     user: 'root',
//     password: '',
//   });
//   await connection.connect();

//   console.log(
//     `Conexión establecida con la base de datos (identificador=${connection.threadId})`
//   );

//   return connection;
// }


//ENDPOINTS






