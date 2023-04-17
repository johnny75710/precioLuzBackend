import { pool } from "../connection.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const getUser = async (req, res) => {
  const username = req.params.UserName;

  try {
    const [rows] = await pool.query("SELECT * FROM USERS WHERE Username = ?", [
      username,
    ]);
    console.log(rows);
    if (rows.length <= 0)
      return res.status(404).json({
        message: "El usuario no existe",
      });

    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ Message: "Error interno, inténtelo nuevamente más tarde" });
  }
};


//Función para crear el usuario
export const createUser = async (req, res) => {
  const { Name, UserName, Password, Security_Q, Security_A, House } = req.body;

  //Con la librería bcrypt, encriptamos la contraseña para mayor seguridad.
  const hashedPwd = await bcrypt.hash(Password, 12);

  //Metemos el código referente a la/s consulta/s en un try/catch, de esta manera si hay un error, el servidor seguirá funcionando
  try {

    //Consulta para saber si existe el usuario
    const user = await pool.query(
      "SELECT UserName FROM USERS WHERE UserName = ?",
      [UserName]
    );

   //Si el nombre de usuario ya existe, devolvemos un error
   if(Object.keys(user[0]).length > 0){
   return res.status(404).json({Message: 'Este nombre de usuario ya existe, por favor, inténtalo con otro'})
   } else {

    //Si el nombre de usuario está disponible, creamos el usuario
    const row = await pool.query(
      "INSERT INTO USERS (`Name`, `UserName`, `Password`, `Security_Q`, `Security_A`, `House`) VALUES (?, ?, ?, ?, ?, ?)",
      [Name, UserName, hashedPwd, Security_Q, Security_A, House]
    );

    res.send({
      ID: row[0].insertId,
      ...req.body,
    });
   }
   
  } catch (error) {
    //Si ha habido algún error, en el proceso, devolvemos un mensaje de error
    return res
      .status(500)
      .json({ Message: "Error interno, inténtelo nuevamente más tarde" });
  }
};

export const updateUser = async (req, res) => {
  const username = req.params.UserName;
  const house = req.body.House;

  const [rows] = await pool.query(
    "UPDATE USERS SET House = ? WHERE UserName = ?",
    [house, username]
  );

  if (rows.affectedRows === 0)
    return res.status(404).json({ Message: "No hay cambios" });

  res.sendStatus(204);
};

export const deleteUser = async (req, res) => {
  const username = req.params.UserName;
  const [rows] = await pool.query("DELETE FROM USERS WHERE UserName = ?", [
    username,
  ]);

  if (rows.affectedRows <= 0)
    return res.status(404).json({ Message: "Usuario no eliminado" });

  res.sendStatus(204);
};

//Función para iniciar sesión
export const loginUser = async (req, res) => {
  const username = req.body.UserName;
  const passowrd = req.body.Password;

  //Metemos el código referente a la/s consulta/s en un try/catch, de esta manera si hay un error, el servidor seguirá funcionando
  try {

    //Primero comprobamos que el usuario existe
    const [name] = await pool.query(
      "SELECT UserName FROM USERS WHERE UserName = ?",
      [username]
    );

    if (name.length > 0) {
      const [result] = await pool.query(
        "SELECT Password FROM USERS WHERE UserName = ?",
        [username]
      );

      //Comprobamos que la contraseña esté correcta
      const isEqual = await bcrypt.compare(passowrd, result[0].Password);

      if (isEqual) {
        const [house] = await pool.query(
          "SELECT HOUSE FROM USERS WHERE UserName = ?",
          [username]
        );
        const token = jwt.sign({ username: username }, 'mysecretkey');
        return res.json({
          token: token,
          username: username,
          house: house[0].HOUSE
        })
        
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

export const resetPassword = async(req, res) => {
  const username = req.body.UserName
  const password = req.body.Password;
  const security_q = req.body.Security_Q
  const security_a = req.body.Security_A

  //Encriptamos la nueva contraseña elegida por el usuario
  const hashedPwd = await bcrypt.hash(password, 12);

  //Metemos el código referente a la/s consulta/s en un try/catch, de esta manera si hay un error, el servidor seguirá funcionando
  try{ 
    //Compprobamos que el usuario al que se le quiere cambiar la contraseña existe realmente
    const [name] = await pool.query(
    "SELECT UserName FROM USERS WHERE UserName = ?",
    [username]
  );

  if (name.length > 0) {
    const [question] = await pool.query(
      "SELECT SECURITY_Q, SECURITY_A FROM USERS WHERE UserName = ?",
      [username]
    );

    //Comprobamos si la pregunta de seguridad y la respuesta elegida por el usuario coincide con la que hay en la base de datos para dicho usuario, procedemos con el restablecimiento
    //de la contraseña
    if(security_q == question[0].SECURITY_Q && security_a == question[0].SECURITY_A){
      await pool.query(
        "UPDATE USERS SET PASSWORD = ? WHERE UserName = ?",
        [hashedPwd,username]
      );
      return res.send({Message: "Correct!"})
    } else {
      return res.status(404).json({Message: "La pregunta y/o la respuesta no coincide con la almacenada en la base de datos."})
    }
  } else {
    return res.status(404).json({ Message: "Usuario incorrecto"})
  }} catch {
    //Para cualquier otro error
    console.log(error)
    res.status(500).json({ Message: "Error interno" });

  }
}