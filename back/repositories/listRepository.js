const dbConnection = require("./../config/db-config");

const insertList = async (list) => {
  const query = `
    INSERT INTO list (user_id, name, created_at)
    VALUES ($1, $2,NOW())
    RETURNING id
  `;
  const values = [list.userID, list.name];

  const result = await dbConnection.query(query, values);
  return result;
};

const insertIntoList = async (list) => {
  const query = `
    INSERT INTO movie_list (list_id,movie_id)
    VALUES ($1, $2)
  `;
  const values = [list.listID, list.movieID];

  const result = await dbConnection.query(query, values);
  return result;
};

const deleteList = async (id) => {
  const query = `
  DELETE FROM list WHERE id = $1;
  `;
  const values = [id];

  const result = await dbConnection.query(query, values);
  return result;
};

const deleteFromList = async (list) => {
  const query = `
    DELETE FROM movie_list WHERE list_id=$1 AND movie_id=$2
  `;
  const values = [list.listID, list.movieID];

  const result = await dbConnection.query(query, values);
  return result;
};

const getList = async (id) => {
  const query = `
SELECT *
FROM movie m
LEFT OUTER JOIN movie_critic mc ON m.id = mc.movie_id
INNER JOIN critic c ON c.id = mc.critic_id AND c.name LIKE 'IMDB' AND m.id IN (SELECT movie_id FROM movie_list WHERE list_id=$1)
  `;
  const values = [id];

  const result = await dbConnection.query(query, values);
  return result.rows;
};

const getListName = async (id) => {
  const query = `
SELECT * FROM list WHERE id=$1
  `;
  const values = [id];
  const result = await dbConnection.query(query, values);
  if (result.rowCount == 0) return null;
  else return result.rows[0];
};

module.exports = {
  insertList,
  insertIntoList,
  deleteList,
  getList,
  getListName,
  deleteFromList,
};
