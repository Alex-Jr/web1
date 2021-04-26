const database = require("../setup");
const deleteSessao = require("./deleteSessao");

module.exports = async (token, userId) => {
  await deleteSessao(userId);

  return new Promise((resolve, reject) => {
    const date = new Date();
    date.setDate(date.getDate() + 7);

    const sql = 'INSERT INTO sessao VALUES (?, ?, ?)';
    const values = [token, userId, date];

    database.query(sql, values, (err, results, fields) => {
      if(err) {
        reject(err);
        return
      }

      resolve(results);
      return;
    })
  })
}