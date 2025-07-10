const dbConnection = require("./../config/db-config");

const getCritics = async (id) => {
  const query = `
  SELECT * FROM critic
  `;

  const result = await dbConnection.query(query);
  return result.rows;
};

const addCritic = async (name) => {
  const query = `
  INSERT INTO critic(name) VALUES ($1) RETURNING id
  `;
  const values = [name];

  const result = await dbConnection.query(query, values);
  return result.rows[0].id;
};

const addCriticRating = async (movieID, criticID, rating) => {
  const query = `
  INSERT INTO movie_critic(movie_id,critic_id,rating) VALUES ($1,$2,$3)
  `;

  const values = [movieID, criticID, rating];

  const result = await dbConnection.query(query, values);
  return result;
};

module.exports = {
  getCritics,
  addCritic,
  addCriticRating,
};
