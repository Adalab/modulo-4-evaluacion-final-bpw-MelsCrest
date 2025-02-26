//IMPORTS 
const express = require("express");
const cors = require("cors");
const mysql = require('mysql2/promise');

//CREAR SERVIDOR 
const server = express();

//CONFIGURAR SERVIDOR 
server.use(cors());
server.use(express.json());
require("dotenv").config();

//PUERTO 
const PORT = process.env.PORT; 
server.listen(PORT, ()=>{
  console.log(`Servidor corriendo por http://localhost:${PORT}`);
});

//CONEXION A LA BASE DE DATOS MSQL2
async function connectionDB() {
  const connection = await mysql.createConnection({
    host: process.env.HOSTDB,
    user: process.env.USERDB,
    password: process.env.PASSDB,
    database: process.env.DATABASE
  });
  await connection.connect();

  console.log(
    `Conexión establecida con la base de datos (identificador=${connection.threadId})`
  );

  return connection;
}


//ENDPOINTS






