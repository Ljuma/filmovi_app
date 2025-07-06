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

module.exports = { findUserByEmail, insertUser, findAdminById };
