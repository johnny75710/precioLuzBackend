import { pool } from "../connection.js";
import https from "https";
import { Prices } from "../classes/prices.class.js";

//Clase para guardar los precios de la API de REE
class PriceController {
  constructor() {
    this.url = "https://api.esios.ree.es/archives/70/download_json?locale=es";
  }

  //Funcion para obtener los precios de la API de REE
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

  //Funcion para guardar los precios en la base de datos
  async savePrices() {

    //Obtenemos la fecha actual
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    //Bloque try/catch para manejar errores
    try {
      const price = new Prices();
      price.date = `${day}/${month}/${year}`;

      //Llamamos a la funcion getPrices() para obtener los precios
      const jsonData = await this.getPrices();

      //Comprobamos si la fecha de los precios de la API está en la base de datos para no repetir datos
      const row = await pool.query(
        "SELECT EXISTS(SELECT Date FROM PRICES WHERE DATE = ?)",
        [jsonData.PVPC[0].Dia]
      );

      //Si no está, guardamos los precios en la base de datos
      if (Object.values(row[0][0])[0] == 0) {

        //Guardamos los precios en un array
        let prices = [];
        for (let i = 0; i < jsonData.PVPC.length; i++) {
          prices[i] = parseFloat(
            jsonData.PVPC[i].PCB.replace(/,/g, ".") / 1000
          );
        }

        //Obtenemos el precio mínimo y máximo
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        //Guardamos el estado de cada precio (si es mínimo o máximo)
        for (let i = 0; i < prices.length; i++) {
          if (prices[i] == minPrice) {
            price.isMin = "YES";
          } else {
            price.isMin = "NO";
          }

          if (prices[i] == maxPrice) {
            price.isMax = "YES";
          } else {
            price.isMax = "NO";
          }

          //Guardamos los precios en la base de datos
          await pool.query(
            "INSERT INTO PRICES (Date, Hour, Price, isMIN, isMAX) VALUES ( ?, ?, ?, ?, ?)",
            [
              jsonData.PVPC[i].Dia,
              jsonData.PVPC[i].Hora,
              prices[i],
              price.isMin,
              price.isMax,
            ]
          );
        }
      }
    } catch (error) {
      console.error("Error obteniendo precios:", error);
    }
  }
}

export default PriceController;
