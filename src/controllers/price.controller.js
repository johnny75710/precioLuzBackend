import { pool } from "../connection.js";
import https from "https";



class PriceController {
  constructor() {
    this.url = "https://api.esios.ree.es/archives/70/download_json?locale=es";
  }

  async getPrices() {
    return new Promise((resolve, reject) => {
      const req = https.get(this.url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        });
      });
      req.on("error", (error) => {
        reject(error);
      });
    });
  }

  async savePrices() {
    try {
      const jsonData = await this.getPrices();

      const row = await pool.query(
        "SELECT EXISTS(SELECT Date FROM PRICES WHERE DATE = ?)",
        [jsonData.PVPC[0].Dia]
      );

      if (Object.values(row[0][0])[0] == 0) {
        let prices = [];
        for (let i = 0; i < jsonData.PVPC.length; i++) {
          prices[i] = parseFloat(
            jsonData.PVPC[i].PCB.replace(/,/g, ".") / 1000
          );
        }
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        for (let i = 0; i < prices.length; i++) {
          let isMin = "";
          if (prices[i] == minPrice) {
            isMin = "YES";
          } else {
            isMin = "NO";
          }

          let isMax = "";
          if (prices[i] == maxPrice) {
            isMax = "YES";
          } else {
            isMax = "NO";
          }

          await pool.query(
            "INSERT INTO PRICES (Date, Hour, Price, isMIN, isMAX) VALUES ( ?, ?, ?, ?, ?)",
            [
              jsonData.PVPC[i].Dia,
              jsonData.PVPC[i].Hora,
              prices[i],
              isMin,
              isMax
            ]
          );
        }
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  }
}

export default PriceController;