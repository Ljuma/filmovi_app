const express = require("express");
const listRouter = express.Router();
const listController = require("../controllers/listController.js");

listRouter.route("/addlist").post(listController.addList);
listRouter.route("/addtolist/:listID").post(listController.addToList);
listRouter.route("/deletelist/:id").delete(listController.deleteList);
listRouter.route("/list/:id").get(listController.getList);
listRouter.route("/deletefromlist/:id").delete(listController.deleteFromList);

module.exports = listRouter;
