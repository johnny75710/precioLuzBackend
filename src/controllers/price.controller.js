import { pool } from "../connection.js";
import https from "https";

const url = "https://api.esios.ree.es/archives/70/download_json?locale=es";

export const getPrices = () => {
    return new Promise((resolve, reject) => {
      const req = https.get(url, (res) => {
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
  };

export const savePrices = async () => {

    getPrices()
  .then(async (jsonData) => {
    // Handle successful response
    const row = await pool.query(
      "SELECT EXISTS(SELECT Date FROM PRICES WHERE DATE = ?)",
      [jsonData.PVPC[0].Dia]
    );

    if(Object.values(row[0][0])[0] == 0){

       
        let prices = [];
        for (let i = 0; i < jsonData.PVPC.length; i++){
            prices[i] = (parseFloat(jsonData.PVPC[i].PCB.replace(/,/g, '.')/1000)).toFixed(3);
        }
        const minPrice = (Math.min(...prices))

        for (let i = 0; i < prices.length; i++) {
          let isMin = '';
          if(prices[i] == minPrice){
            isMin = 'YES'
          } else{
            isMin = 'NO'
          }
            await pool.query(
                "INSERT INTO PRICES (Date, Hour, Price, isMIN) VALUES ( ?, ?, ?, ?)",
                [jsonData.PVPC[i].Dia, jsonData.PVPC[i].Hora.slice(0, 2), prices[i], isMin]
              );
        }
    }

  })
  .catch((error) => {
    // Handle error
    console.error("Error fetching prices:", error);
  });

};

