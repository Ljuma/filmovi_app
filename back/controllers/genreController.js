const genreRepository = require("./../repositories/genreRepository");
const db = require("../config/db-config");

const getAllGenres = async (req, res) => {
  try {
    let genresDB = await genreRepository.getAllGenres();

    let genres = genresDB.map((g) => ({
      value: g.id,
      label: g.name,
    }));
    res.status(200).json({
      message: "Uspješno",
      genres: genres,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri uzimanju zanrova." });
  }
};

module.exports = {
  getAllGenres,
};
