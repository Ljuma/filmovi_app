const express = require("express");
const reviewRouter = express.Router();
const reviewController = require("../controllers/reviewController.js");

reviewRouter.route("/addreview").post(reviewController.addReview);

module.exports = reviewRouter;
