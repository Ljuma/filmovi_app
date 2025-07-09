const dbConnection = require("./../config/db-config");

const insertUser = async (user) => {
  const query = `
    INSERT INTO "user" (name, password, email, photo)
    VALUES ($1, $2, $3, $4)`;

  const values = [user.name, user.password, user.email, user.photo];

  const result = await dbConnection.query(query, values);
  return result;
};

const findUserByEmail = async (userMail) => {
  const query = `SELECT * FROM "user" WHERE email LIKE $1`;
  const values = [userMail];

  const result = await dbConnection.query(query, values);
  return result.rows[0];
};

const findAdminById = async (id) => {
  const query = `SELECT * FROM "admin" WHERE user_id = $1`;
  const values = [id];

  const result = await dbConnection.query(query, values);
  return result;
};

const getUser = async (id) => {
  const query = `SELECT * FROM "user" WHERE id=$1`;
  const values = [id];

  const result = await dbConnection.query(query, values);
  return result.rows[0];
};

const getUserLists = async (id) => {
  const query = `SELECT l.id,l.name,COUNT(ml.movie_id) AS list_size FROM list l LEFT OUTER JOIN movie_list ml ON l.id=ml.list_id  
WHERE l.user_id=$1 GROUP BY l.id,l.name
 `;
  const values = [id];
  const result = await dbConnection.query(query, values);

  if (result.rows.length > 0) {
    return result.rows;
  } else {
    return null;
  }
};

const getUserNumOfReviews = async (id) => {
  const query = `SELECT COUNT(*) as num FROM movie_user WHERE user_id=$1 `;
  const values = [id];
  const result = await dbConnection.query(query, values);

  if (result.rows.length > 0) {
    return result.rows[0].num;
  } else {
    return 0;
  }
};

const getUserAvgReview = async (id) => {
  const query = `SELECT AVG(rating) as num FROM movie_user WHERE user_id=$1 `;
  const values = [id];
  const result = await dbConnection.query(query, values);

  if (result.rows.length > 0) {
    return result.rows[0].num;
  } else {
    return 0;
  }
};

const getUserListCount = async (id) => {
  const query = `SELECT COUNT(*) as num FROM list WHERE user_id=$1 `;
  const values = [id];
  const result = await dbConnection.query(query, values);

  if (result.rows.length > 0) {
    return result.rows[0].num;
  } else {
    return 0;
  }
};

const deleteUser = async (id) => {
  const query = `UPDATE "user" SET deleted_at = NOW() WHERE id = $1`;
  const values = [id];
  const result = await dbConnection.query(query, values);
  return result;
};

const restoreUser = async (id) => {
  const query = `UPDATE "user" SET deleted_at = NULL WHERE id = $1`;
  const values = [id];
  const result = await dbConnection.query(query, values);
  return result;
};

module.exports = {
  findUserByEmail,
  insertUser,
  findAdminById,
  getUser,
  getUserLists,
  getUserNumOfReviews,
  getUserAvgReview,
  getUserListCount,
  deleteUser,
  restoreUser,
};
