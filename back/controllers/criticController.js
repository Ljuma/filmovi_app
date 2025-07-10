const criticRepository = require("./../repositories/criticRepository");
const db = require("../config/db-config");

const getCritics = async (req, res) => {
  try {
    const critics = await criticRepository.getCritics();

    res.status(200).json({ message: "Uspjesno uzimanje.", critics: critics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška." });
  }
};

const addCritic = async (req, res) => {
  try {
    const { criticName } = req.body;
    const id = await criticRepository.addCritic(criticName);

    res.status(200).json({ message: "Uspjesno dodavanje.", criticID: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška." });
  }
};

const addCriticRating = async (req, res) => {
  try {
    const { criticID, movieID, rating } = req.body;
    const id = await criticRepository.addCriticRating(
      movieID,
      criticID,
      rating
    );

    res.status(200).json({ message: "Uspjesno dodavanje." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška." });
  }
};

module.exports = {
  getCritics,
  addCritic,
  addCriticRating,
};
