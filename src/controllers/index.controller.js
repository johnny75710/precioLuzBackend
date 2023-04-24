
export const Users = async (req, res) => {
    const result = await pool.query("SELECT * FROM USERS");
    res.json(result[0]);
    
  }