const dbConnection = require("./../config/db-config");

const getAllGenres = async () => {
  const result = await dbConnection.query(`SELECT * FROM genre`);
  return result.rows;
};

module.exports = {
  getAllGenres,
};
