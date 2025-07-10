const express = require("express");
const reviewRouter = express.Router();
const reviewController = require("../controllers/reviewController.js");

reviewRouter.route("/addreview").post(reviewController.addReview);
reviewRouter.route("/deletereview/:id").delete(reviewController.deleteReview);

module.exports = reviewRouter;
