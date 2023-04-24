import { pool } from "../connection.js";

export const getConsumption = async (req, res) => {
  const date = req.body.date;
  console.log(date)
  console.log(req.body)
 try {
    const [rows] = await pool.query("SELECT Hour, Price, isMIN FROM PRICES WHERE Date = ?", [
        date,
      ]);
    console.log(rows.length)
      if(rows.length == 0){
        return res.status(404).json({Message: "Date Not Found"})
      } else{
        return res.json({Data: rows});
      }


 } catch (error) {
    return res
      .status(500)
      .json({ Message: "Error interno, inténtelo nuevamente más tarde" });
 }
};
