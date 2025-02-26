//IMPORTS 
const express = require("express");
const cors = require("cors");
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');    
const bcrypt = require("bcrypt");

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
//añadir un restaurante - body params
server.post('/restaurants', async(req, res)=>{
  try {
    const connection = await connectionDB();
    const {name, cousine_style, area, price_range, fk_areas, fk_cousine_style} = req.body;
    const sqlInsert = "INSERT INTO restaurant (name, cousine_style, area, price_range, fk_areas, fk_cousine_style) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await connection.query(sqlInsert, [name, cousine_style, area, price_range, fk_areas, fk_cousine_style]);
    connection.end();
    if(result){
      res.status(201).json({
        success : true,
        id : result.insertId
      });
    }else{
      res.status(400).json({
        success : false,
        message : "No se ha podido guardar el restaurante"
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Mostrar todos los restaurantes - body params
server.get('/restaurants', async(req, res)=>{
  try {
    const connection = await connectionDB();
    const sqlSelect = "SELECT * FROM restaurant";
    const [result] = await connection.query(sqlSelect);
    connection.end();

    if(result){
      res.status(200).json({
        result : result
      })
    }else{
      res.status(404).json({
        success : false,
        message : "No se han encontrado restaurantes"
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Actualizar un restaurante - url params
server.put('/restaurants/:id', async(req, res)=>{
  try {
    const connection = await connectionDB();
    const {id} = req.params;
    const {name, cousine_style, area, price_range, fk_areas, fk_cousine_style} = req.body;
    const sqlUpdate = "UPDATE restaurant SET name = ?, cousine_style = ?, area = ?, price_range = ?, fk_areas = ?, fk_cousine_style = ? WHERE idrestaurant = ?";
    const [result] = await connection.query(sqlUpdate, [name, cousine_style, area, price_range, fk_areas, fk_cousine_style, id]);
    connection.end();
    if (result.affectedRows > 0) {
      res.status(200).json({
        success : true
      });      
    } else {
      res.status(400).json({
        success : false,
        message : "No se han podido actualizar los datos"
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Eliminar un restaurante - url params
server.delete('/restaurants/:id', async(req, res)=>{
  try {
    const connection = await connectionDB();
    const {id} = req.params;
    const sqlDelete = "DELETE FROM restaurant WHERE idrestaurant = ?";
    const [result] = await connection.query(sqlDelete, [id]);
    connection.end();
    if (result.affectedRows > 0) {
      res.status(200).json({
        success : true
      });
    } else {
      res.status(400).json({
        success : false,
        message : "No se ha podido eliminar el restaurante"
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Registrar un usuario
server.post('/registro', async(req, res)=>{
  try {
    const connection = await connectionDB();
    const {email, nombre, password} = req.body;
    const sqlSelectEmail = "SELECT email FROM usuarios_db WHERE email = ?";
    const [emailResult] = await connection.query(sqlSelectEmail, [email]);
    if (emailResult.length === 0) {
      const passHashed = await bcrypt.hash(password, 10);
      const sqlInsertUser = "INSERT INTO usuarios_db (email, nombre, password) VALUES (?, ?, ?)";
      const [result] = await connection.query(sqlInsertUser, [email, nombre, passHashed]);
      res.status(201).json({
        success : true,
        id: result.insertId
      });
    } else {
      res.status(200).json({
        success : false,
        error : 'Error. El usuario ya existe'
      });
    }  
    connection.end();
  } catch (error) {
    res.status(500).json(error);
  }
});

//Inicio de sesión
server.post('/login', async(req, res)=>{
  try {
    const connection = await connectionDB();
    const {email, password} = req.body;
    const sqlSelectEmail = "SELECT * FROM usuarios_db WHERE email = ?";
    const [resultUser] = await connection.query(sqlSelectEmail, [email]);
    connection.end();
    if (resultUser.length !== 0) {
      const passDB = resultUser[0].password;
      const isSamePassword = await bcrypt.compare(password, passDB);
      if (isSamePassword) {
        const infoToken = {email : resultUser[0].email, id : resultUser[0].id};
        const token = jwt.sign(infoToken, process.env.PASS, {expiresIn : '1h'});
        res.status(200).json({
          success : true,
          token : token
        });
      } else {
        res.status(200).json({
          success : false,
          message : 'Contraseña incorrecta'
        })
      }
      
    } else {
      res.status(200).json({
        success : false, 
        message : 'Email incorrecto'});
    }

  } catch (error) {
    res.status(500).json(error);
  }
})
