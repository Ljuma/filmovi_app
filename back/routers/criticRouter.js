const express = require("express");
const criticRouter = express.Router();
const criticController = require("../controllers/criticController.js");

criticRouter.route("/critics").get(criticController.getCritics);
criticRouter.route("/addcritic").post(criticController.addCritic);
criticRouter.route("/addcriticrating").post(criticController.addCriticRating);

module.exports = criticRouter;
