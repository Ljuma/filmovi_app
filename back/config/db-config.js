const { Pool } = require('pg');


const  dbConnection = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'filmovi_app',
  password: 'lukaljuma22',
  port: 5432,
});

module.exports = dbConnection;