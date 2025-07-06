const express = require("express");
const authRouter = express.Router();
const uploadUserPhoto = require("../config/multerUserConfig");
const authController = require("../controllers/authController.js");

authRouter.route("/login").post(authController.login);

authRouter
  .route("/register")
  .post(uploadUserPhoto.single("file"), authController.register);

module.exports = authRouter;
