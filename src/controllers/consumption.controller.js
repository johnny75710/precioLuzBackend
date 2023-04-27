import { pool } from "../connection.js";

class Consumption {
  #pool;

  constructor() {
    this.#pool = pool;
  }

  async getConsumption(req, res) {
    const date = req.body.date;
    try {
      const [rows] = await this.#pool.query("SELECT Hour, Price, isMIN, isMAX FROM PRICES WHERE Date = ?", [date]);
      if (rows.length == 0) {
        return res.status(404).json({ Message: "Date Not Found" });
      } else {
        return res.json({ Data: rows });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ Message: "Error interno, inténtelo nuevamente más tarde" });
    }
  }

  async getLoggedConsumption(req, res) {
    const user = req.params.user;
    try {
      const [rows] = await this.#pool.query(
        "SELECT WATS FROM HOUSE WHERE ID = (SELECT HOUSE FROM USERS WHERE Username = ?);",
        [user]
      );
      if (rows.length == 0) {
        return res.status(404).json({
          Message: "Hay un problema y el consumo no se ha encontrado en el servidor",
        });
      } else {
        return res.json(rows[0]);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ Message: "Error interno, inténtelo nuevamente más tarde" });
    }
  }
}

export default Consumption;
