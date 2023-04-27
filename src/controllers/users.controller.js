import { pool } from "../connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../classes/user.class.js";



export class UserController {

  //Función para obtener el usuario
  async getUser(req, res){
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, "mysecretkey");
      const user = new User();
      user.userName = decodedToken.username;
      console.log(user.userName)
      const [rows] = await pool.query(
        "SELECT username FROM USERS WHERE Username = ?",
        [user.userName]
      );
  
      console.log(rows)
      res.json({ user: rows[0].username });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ Message: "Error interno, inténtelo nuevamente más tarde" });
    }
  };
  
  //Función para crear el usuario
  async createUser(req, res){
    const user = new User(req.body.Name, req.body.UserName, req.body.Password, req.body.Security_Q, req.body.Security_A, req.body.House);
    user.name = req.body.Name;
    user.userName =  req.body.UserName
    user.password = req.body.Password;
    user.security_Q.id = req.body.Security_Q;
    user.security_A = req.body.Security_A;
    user.house.id = req.body.House;
  
    //Con la librería bcrypt, encriptamos la contraseña para mayor seguridad.
    const hashedPwd = await bcrypt.hash(user.password, 12);
  
    //Metemos el código referente a la/s consulta/s en un try/catch, de esta manera si hay un error, el servidor seguirá funcionando
    try {
      //Consulta para saber si existe el usuario
      const userr = await pool.query(
        "SELECT UserName FROM USERS WHERE UserName = ?",
        [user.userName]
      );
  
      //Si el nombre de usuario ya existe, devolvemos un error
      if (Object.keys(userr[0]).length > 0) {
        return res
          .status(404)
          .json({
            Message:
              "Este nombre de usuario ya existe, por favor, inténtalo con otro",
          });
      } else {
        //Si el nombre de usuario está disponible, creamos el usuario
        const row = await pool.query(
          "INSERT INTO USERS (`Name`, `UserName`, `Password`, `Security_Q`, `Security_A`, `House`) VALUES (?, ?, ?, ?, ?, ?)",
          [user.name, user.userName, hashedPwd, user.security_Q.id, user.security_A, user.house.ID]
        );
  
        res.send({
          ID: row[0].insertId,
          ...req.body,
        });
      }
    } catch (error) {
      console.log(error)
      //Si ha habido algún error, en el proceso, devolvemos un mensaje de error
      return res
        .status(500)
        .json({ Message: "Error interno, inténtelo nuevamente más tarde" });
    }
  };
  
  
  async deleteUser(req, res) {
    
    try {
      const user = new User();
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, "mysecretkey");
      user.userName = decodedToken.username;
  
      const [rows] = await pool.query("DELETE FROM USERS WHERE UserName = ?", [
        user.userName,
      ]);
  
      if (rows.affectedRows <= 0)
        return res.status(404).json({ Message: "Usuario no eliminado" });
  
      res.json({ Message: "Usuario borrado" });
    } catch {
      res.status(500).json({ Message: "Error interno" });
    }
  };
  
  //Función para iniciar sesión
  async loginUser(req, res){
    const user = new User();
    user.userName = req.body.UserName;
    user.password = req.body.Password;
    
  
    //Metemos el código referente a la/s consulta/s en un try/catch, de esta manera si hay un error, el servidor seguirá funcionando
    try {
      //Primero comprobamos que el usuario existe
      const [name] = await pool.query(
        "SELECT UserName FROM USERS WHERE UserName = ?",
        [user.userName]
      );
  
      if (name.length > 0) {
        const [result] = await pool.query(
          "SELECT Password FROM USERS WHERE UserName = ?",
          [user.userName]
        );
  
        //Comprobamos que la contraseña esté correcta
        const isEqual = await bcrypt.compare(user.password, result[0].Password);
  
        if (isEqual) {
          const [house] = await pool.query(
            "SELECT HOUSE FROM USERS WHERE UserName = ?",
            [user.userName]
          );
          const token = jwt.sign({ username: user.userName }, "mysecretkey");
          return res.json({
            token: token,
            username: user.userName,
            house: house[0].HOUSE,
          });
          
        } else {
          return res.status(404).json({ Message: "Contraseña incorrecta" });
        }
      } else {
        return res.status(404).json({ Message: "Usuario no encontrado" });
      }
    } catch (err) {
      //Para cualquier otro error
      console.log(err);
      res.status(500).json({ Message: "Error interno" });
    }
  };
  
  async resetPassword(req, res){

    const user = new User();
    user.userName = req.body.UserName;
    user.password = req.body.Password;
    user.security_Q.id = req.body.Security_Q;
    user.security_A = req.body.Security_A;

    //Encriptamos la nueva contraseña elegida por el usuario
    const hashedPwd = await bcrypt.hash(user.password, 12);
  
    //Metemos el código referente a la/s consulta/s en un try/catch, de esta manera si hay un error, el servidor seguirá funcionando
    try {
      //Compprobamos que el usuario al que se le quiere cambiar la contraseña existe realmente
      const [name] = await pool.query(
        "SELECT UserName FROM USERS WHERE UserName = ?",
        [user.userName]
      );
  
      if (name.length > 0) {
        const [question] = await pool.query(
          "SELECT SECURITY_Q, SECURITY_A FROM USERS WHERE UserName = ?",
          [user.userName]
        );
  
        //Comprobamos si la pregunta de seguridad y la respuesta elegida por el usuario coincide con la que hay en la base de datos para dicho usuario, procedemos con el restablecimiento
        //de la contraseña
        if (
          user.security_Q.ID == question[0].SECURITY_Q &&
          user.security_A == question[0].SECURITY_A
        ) {
          await pool.query("UPDATE USERS SET PASSWORD = ? WHERE UserName = ?", [
            hashedPwd,
            user.userName,
          ]);
          return res.send({ Message: "Correct!" });
        } else {
          return res
            .status(404)
            .json({
              Message:
                "La pregunta y/o la respuesta no coincide con la almacenada en la base de datos.",
            });
        }
      } else {
        return res.status(404).json({ Message: "Usuario incorrecto" });
      }
    } catch {
      //Para cualquier otro error
      console.log(error);
      res.status(500).json({ Message: "Error interno" });
    }
  };
  
  async updateConsumption(req, res){
  
    try {
      const user = new User();
      user.house.ID = req.body.House;
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, "mysecretkey");
      user.userName = decodedToken.username;
      await pool.query("UPDATE USERS SET House = ? WHERE Username = ?", [
        user.house.ID,
        user.userName,
      ]);
  
      res.json({ Message: "Consumo cambiado correctamente" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ Message: "Error interno, inténtelo nuevamente más tarde" });
    }
  };
  
}

export default UserController;
