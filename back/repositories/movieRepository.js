const dbConnection = require("./../config/db-config");

const newestMovies = async () => {
  const result = await dbConnection.query(
    `SELECT * FROM movie ORDER BY release_date desc LIMIT 12`
  );
  return result.rows;
};

const topRatedMovies = async () => {
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
  const result = await dbConnection.query(`
SELECT *
FROM movie m
LEFT OUTER JOIN movie_critic mc ON m.id = mc.movie_id
INNER JOIN critic c ON c.id = mc.critic_id AND c.name LIKE 'IMDB'`);

  return result.rows;
};

const getExtremeValues = async () => {
  const result = await dbConnection.query(`SELECT 
  MIN(EXTRACT(YEAR FROM release_date)) AS minYear,
  MAX(EXTRACT(YEAR FROM release_date)) AS maxYear,
  MIN(runtime) AS minRuntime,
  MAX(runtime) AS maxRuntime
FROM movie`);

  return result.rows[0];
};

const filterMovies = async (filter) => {
  const { minYear, maxYear, minRuntime, maxRuntime, genres, title } = filter;

  let params = [minYear, maxYear, minRuntime, maxRuntime];

  let query = `
    SELECT m.*, mc.rating
    FROM movie m
    LEFT JOIN movie_critic mc ON m.id = mc.movie_id
    INNER JOIN critic c ON c.id = mc.critic_id AND c.name = 'IMDB'
    INNER JOIN movie_genre mg ON m.id = mg.movie_id
    WHERE EXTRACT(YEAR FROM m.release_date) BETWEEN $1 AND $2
      AND m.runtime BETWEEN $3 AND $4
  `;

  if (title && title !== "") {
    query += ` AND m.title ILIKE $${params.length + 1}`;
    params.push(`%${title}%`);
  }

  if (genres && genres.length > 0) {
    query += ` AND mg.genre_id = ANY($${params.length + 1})`;
    params.push(genres);

    query += `
      GROUP BY m.id, mc.rating
      HAVING COUNT(DISTINCT mg.genre_id) = $${params.length + 1}
    `;
    params.push(genres.length);
  } else {
    query += ` GROUP BY m.id, mc.rating`;
  }

  const result = await dbConnection.query(query, params);
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
  getExtremeValues,
  filterMovies,
};
