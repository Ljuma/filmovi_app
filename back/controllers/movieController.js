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
    let genres = genresDB.map((g) => ({
      value: g.id,
      label: g.name,
    }));
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

const editMovie = async (req, res) => {
  try {
    const id = req.params.id;
    let m = {};
    const { title, description, trailer, popularity, release_date, runtime } =
      req.body;

    m.id = id;
    m.title = title;
    m.description = description;
    m.trailer = trailer;
    m.popularity = popularity;
    m.release_date = release_date;
    m.runtime = runtime;

    let genres = [];
    if (req.body.genres) {
      genres = JSON.parse(req.body.genres);
    }

    const existingMovie = await movieRepository.findById(id);
    if (!existingMovie)
      return res.status(404).json({ message: "Movie not found" });

    m.photo = existingMovie.photo;
    m.backdrop = existingMovie.backdrop;

    if (req.files?.photo) {
      m.photo = req.files.photo[0].filename;
    }
    if (req.files?.backdrop) {
      m.backdrop = req.files.backdrop[0].filename;
    }

    let response1 = await movieRepository.updateMovie(m);
    let response2 = await movieRepository.updateGenres(m.id, genres);

    res.json({ message: "Film izmijenjen uspješno" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru" });
  }
};

const addMovie = async (req, res) => {
  try {
    let m = {};
    const { title, description, trailer, popularity, release_date, runtime } =
      req.body;

    m.title = title;
    m.description = description;
    m.trailer = trailer;
    m.popularity = popularity;
    m.release_date = release_date;
    m.runtime = runtime;
    m.photo = null;
    m.backdrop = null;

    if (req.files?.photo) {
      m.photo = req.files.photo[0].filename;
    }
    if (req.files?.backdrop) {
      m.backdrop = req.files.backdrop[0].filename;
    }

    let genres = [];
    if (req.body.genres) {
      genres = JSON.parse(req.body.genres);
    }

    let movieID = await movieRepository.insertMovie(m);

    let response = await movieRepository.addGenres(movieID, genres);

    res.json({ message: "Film izmijenjen uspješno" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru" });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const id = req.params.id;

    const results = await movieRepository.deleteMovie(id);

    res.status(200).json({ message: "Uspjesno brisanje." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri brisanju." });
  }
};

module.exports = {
  getHotMovies,
  getTopRatedMovies,
  getMovie,
  getAllMovies,
  getMovieSingle,
  filterMovies,
  editMovie,
  addMovie,
  deleteMovie,
};
