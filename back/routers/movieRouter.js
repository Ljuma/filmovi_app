const express = require("express");
const movieRouter = express.Router();
const movieController = require("../controllers/movieController.js");
const uploadMovieData = require("../config/multerMovieConfig");

movieRouter.route("/hotmovies").get(movieController.getHotMovies);
movieRouter.route("/topratedmovies").get(movieController.getTopRatedMovies);
movieRouter.route("/getmovie/:id").get(movieController.getMovie);
movieRouter.route("/movie/:id").get(movieController.getMovieSingle);
movieRouter.route("/allmovies").get(movieController.getAllMovies);
movieRouter.route("/filtermovies").get(movieController.filterMovies);
movieRouter.route("/addmovie").post(uploadMovieData, movieController.addMovie);
movieRouter.route("/deletemovie/:id").delete(movieController.deleteMovie);
movieRouter
  .route("/editmovie/:id")
  .put(uploadMovieData, movieController.editMovie);
module.exports = movieRouter;
