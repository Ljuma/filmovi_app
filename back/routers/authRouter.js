const express = require("express");
const authRouter = express.Router();
const uploadUserPhoto = require("../config/multerUserConfig");
const authController = require("../controllers/authController.js");

authRouter.route("/login").post(authController.login);

authRouter.route("/user/:id").get(authController.getUser);

authRouter.route("/deleteuser/:id").put(authController.deleteUser);

authRouter.route("/restoreuser/:id").put(authController.restoreUser);

authRouter
  .route("/register")
  .post(uploadUserPhoto.single("file"), authController.register);

module.exports = authRouter;
