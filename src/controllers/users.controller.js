import { pool } from "../connection.js";
import bcrypt from "bcrypt";

export const getUser = async (req, res) => {
  const username = req.params.UserName;

  try {
    const [rows] = await pool.query("SELECT * FROM USERS WHERE Username = ?", [
      username,
    ]);
    console.log(rows)
    if (rows.length <= 0)
      return res.status(404).json({
        message: "El usuario no existe",
      });

    res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ Message: "Error interno, inténtelo nuevamente más tarde" });
  }
};

export const createUser = async (req, res) => {
  const { Name, UserName, Password, Security_Q, Security_A, House } = req.body;
  const hashedPwd = await bcrypt.hash(Password, 12);

  try {
    const row = await pool.query(
      "INSERT INTO USERS (`Name`, `UserName`, `Password`, `Security_Q`, `Security_A`, `House`) VALUES (?, ?, ?, ?, ?, ?)",
      [Name, UserName, hashedPwd, Security_Q, Security_A, House]
    );

    res.send({
      ID: row[0].insertId,
      ...req.body,
    });
  } catch (error) {
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

export const loginUser = async (req, res) => {
  const username = req.body.UserName;
  const passowrd = req.body.Password;

  try {
    const [result] = await pool.query(
      "SELECT Password FROM USERS WHERE UserName = ?",
      [username]
    );

    if (result[0].Password == passowrd) {
      return res.sendStatus(204);
    } else {
      return res.status(404).json({ Message: "Contraseña incorrecta" });
    }
  } catch (err) {
    res.status(500).json({ Message: "Error interno" });
  }
};
