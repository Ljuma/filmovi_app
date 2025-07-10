const dbConnection = require("./../config/db-config");

const getMovieReviews = async (id) => {
  const query = `SELECT mu.id as reviewID,u.id,u.name,u.photo,"comment",rating FROM movie m INNER JOIN movie_user mu ON m.id=mu.movie_id INNER JOIN "user" u ON u.id=mu.user_id 
      WHERE m.id=$1`;
  const values = [id];
  const result = await dbConnection.query(query, values);

  if (result.rows.length > 0) {
    return result.rows;
  } else {
    return null;
  }
};

const insertReview = async (comment) => {
  const query = `
    INSERT INTO movie_user (movie_id, user_id, comment, rating)
    VALUES ($1, $2, $3, $4)`;

  const values = [
    comment.movieID,
    comment.userID,
    comment.comment,
    comment.rating,
  ];

  const result = await dbConnection.query(query, values);
  return result;
};

const deleteReview = async (id) => {
  const query = `
  DELETE FROM movie_user WHERE id = $1;
  `;
  const values = [id];

  const result = await dbConnection.query(query, values);
  return result;
};

module.exports = {
  getMovieReviews,
  insertReview,
  deleteReview,
};
