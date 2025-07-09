const listRepository = require("./../repositories/listRepository");
const db = require("../config/db-config");

const addList = async (req, res) => {
  try {
    const { userID, name } = req.body;

    let l = {};
    l.userID = userID;
    l.name = name;

    const results = await listRepository.insertList(l);
    const newListID = results.rows[0].id;

    res.status(201).json({ message: "Uspjesno dodvanje.", listID: newListID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri dodavanju." });
  }
};

const addToList = async (req, res) => {
  try {
    const listID = req.params.listID;
    const { movieID } = req.body;

    let l = {};
    l.listID = listID;
    l.movieID = movieID;

    console.log(l);

    const results = await listRepository.insertIntoList(l);

    res.status(200).json({ message: "Uspjesno dodvanje." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri dodavanju." });
  }
};

const deleteList = async (req, res) => {
  try {
    const listID = req.params.id;

    const results = await listRepository.deleteList(listID);

    res.status(200).json({ message: "Uspjesno brisanje." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri brisanju." });
  }
};

const getList = async (req, res) => {
  try {
    const listID = req.params.id;

    const movies = await listRepository.getList(listID);
    const list = await listRepository.getListName(listID);
    res
      .status(200)
      .json({ message: "Uspjesno uzimanje.", movies: movies, list: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri brisanju." });
  }
};

const deleteFromList = async (req, res) => {
  try {
    const listID = req.params.id;
    const { movieID } = req.body;

    let l = {};
    l.listID = listID;
    l.movieID = movieID;
    const results = await listRepository.deleteFromList(l);

    res.status(200).json({ message: "Uspjesno brisanje." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri brisanju." });
  }
};

module.exports = {
  addList,
  addToList,
  deleteList,
  getList,
  deleteFromList,
};
