const dbConnection = require("./../config/db-config");

const newestMovies = async () => {
  console.log("C");
  const result = await dbConnection.query(
    `SELECT * FROM movie ORDER BY release_date desc LIMIT 12`
  );
  return result.rows;
};

const topRatedMovies = async () => {
  console.log("toporrr");
  const result = await dbConnection.query(
    `SELECT m.ID,m.photo,title,rating FROM movie m INNER JOIN movie_critic mc ON m.id=mc.movie_id INNER JOIN critic c ON c.id=mc.critic_id 
      WHERE c.name LIKE 'IMDB' ORDER BY rating desc LIMIT 3`
  );
  return result.rows;
};

const getMovie = async (id) => {
  const query = `SELECT * FROM movie WHERE id=$1`;
  const values = [id];

  const result = await dbConnection.query(query, values);

  return result.rows[0];
};

const getMovieDefaultRating = async (id) => {
  const query = `SELECT rating FROM movie m INNER JOIN movie_critic mc ON m.id=mc.movie_id INNER JOIN critic c ON c.id=mc.critic_id 
      WHERE c.name LIKE 'IMDB' AND m.id=$1`;
  const values = [id];
  const result = await dbConnection.query(query, values);

  if (result.rows.length > 0) {
    return result.rows[0].rating;
  } else {
    return null;
  }
};

const getMovieRating = async (id) => {
  const query = `SELECT name,rating FROM movie m INNER JOIN movie_critic mc ON m.id=mc.movie_id INNER JOIN critic c ON c.id=mc.critic_id 
      WHERE m.id=$1`;
  const values = [id];
  const result = await dbConnection.query(query, values);

  if (result.rows.length > 0) {
    return result.rows;
  } else {
    return null;
  }
};


const getMovieGenres = async (id) => {
  const query = `SELECT g.name FROM movie m INNER JOIN movie_genre mg ON m.ID=mg.movie_id INNER JOIN genre g on g.id=mg.genre_id WHERE m.id=$1`;
  const values = [id];
  const result = await dbConnection.query(query, values);

  return result.rows;
};

const getAllMovies = async () => {
  const result = await dbConnection.query(`SELECT * 
FROM movie m
LEFT OUTER JOIN movie_critic mc ON m.id = mc.movie_id
LEFT OUTER JOIN critic c ON c.id = mc.critic_id AND c.name LIKE 'IMDB'`);

  return result.rows;
};

module.exports = {
  newestMovies,
  topRatedMovies,
  getMovie,
  getMovieRating,
  getMovieGenres,
  getAllMovies,
  getMovieDefaultRating,
};
