const database = require("../../database/setup");
const loginValidator = require("../../validator/login");
const { decrypt } = require('../../utils/crypto');

const { ServerResponse } = require('http')

/**
 * 
 * @param {*} req 
 * @param {ServerResponse} res 
 * @param {*} body 
 */
module.exports = (req, res) => {
  try {
    const body = req.body;
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    
    loginValidator(body);

    const {
      email,
      senha,
    } = body;

    const sql = 'select * from usuario where email = ?';
    const values = [email]; 

    database.query(sql, values, (errors, results, fields) => {
      if(errors) {
        res.statusCode = 500;
        res.end('Internal server error');
        return;
      }

      if(results.length === 0) {
        res.statusCode = 401;
        res.end('Email não encontrado');
        return;
      }
      const infos = results[0];

      if(decrypt(infos.senha) !== senha){
        res.statusCode = 400;
        res.end('Senha errada');
        return;
      }

      res.end(JSON.stringify(infos));
    }); 
  } catch (err) {
      console.warn(err);

      switch (err.name) {
          case 'ValidationError': 
              res.statusCode = 400;
              res.end(err.message)
              break
          default :
              res.statusCode = 500;
              res.end('Internal server error');
              break;
      }
  } 
}