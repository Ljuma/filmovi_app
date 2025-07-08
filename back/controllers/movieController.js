const movieRepository = require("./../repositories/movieRepository");
const reviewRepository = require("./../repositories/reviewRepository");
const db = require("../config/db-config");

const getHotMovies = async (req, res) => {
  console.log("b");
  try {
    let movies = await movieRepository.newestMovies();

    res.status(200).json({
      message: "Uspješno",
      movies: movies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri uzimanju filmova." });
  }
};

const getTopRatedMovies = async (req, res) => {
  console.log("topr");
  try {
    let movies = await movieRepository.topRatedMovies();

    res.status(200).json({
      message: "Uspješno",
      movies: movies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri uzimanju filmova." });
  }
};

const getMovieSingle = async (req, res) => {
  let id = req.params.id;
  try {
    let movie = await movieRepository.getMovie(id);

    movie.rating = await movieRepository.getMovieRating(id);

    let genresDB = await movieRepository.getMovieGenres(id);
    let genres = genresDB.map((g) => g.name);
    movie.genres = genres;

    movie.reviews = await reviewRepository.getMovieReviews(id);

    res.status(200).json({
      message: "Uspješno preuzimanje filma!",
      movie: movie,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri uzimanju filma ." });
  }
};

const getMovie = async (req, res) => {
  let id = req.params.id;
  try {
    let movie = await movieRepository.getMovie(id);

    movie.rating = await movieRepository.getMovieDefaultRating(id);

    let genresDB = await movieRepository.getMovieGenres(id);
    let genres = genresDB.map((g) => g.name);
    movie.genres = genres.join(", ");

    res.status(200).json({
      message: "Uspješno",
      movie: movie,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri uzimanju filmova." });
  }
};

const getAllMovies = async (req, res) => {
  try {
    let movies = await movieRepository.getAllMovies();

    let extremeValues = await movieRepository.getExtremeValues();

    res.status(200).json({
      message: "Uspješno",
      movies: movies,
      extremeValues: extremeValues,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri uzimanju filmova." });
  }
};

const filterMovies = async (req, res) => {
  try {
    const { minYear, maxYear, minRuntime, maxRuntime, genres, title } =
      req.query;

    const genreIds = genres ? genres.split(",").map((id) => Number(id)) : [];

    let filter = {
      minYear: Number(minYear),
      maxYear: Number(maxYear),
      minRuntime: Number(minRuntime),
      maxRuntime: Number(maxRuntime),
      genres: genreIds,
      title: title || "",
    };

    let movies = await movieRepository.filterMovies(filter);

    res.status(200).json({
      message: "Uspješno",
      movies: movies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri uzimanju filmova." });
  }
};

module.exports = {
  getHotMovies,
  getTopRatedMovies,
  getMovie,
  getAllMovies,
  getMovieSingle,
  filterMovies,
};
