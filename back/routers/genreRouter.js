const express = require("express");
const genreRouter = express.Router();
const genreController = require("../controllers/genreController.js");

genreRouter.route("/genres").get(genreController.getAllGenres);

module.exports = genreRouter;
