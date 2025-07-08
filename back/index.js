const express = require("express");
const dbConnection = require("./config/db-config");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var { expressjwt: expressjwt } = require("express-jwt");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

const authRouter = require("./routers/authRouter");
app.use("/api", authRouter);

const movieRouter = require("./routers/movieRouter");
app.use("/api", movieRouter);

const reviewRouter = require("./routers/reviewRouter");
app.use("/api", reviewRouter);

const genreRouter = require("./routers/genreRouter");
app.use("/api", genreRouter);

app.listen(3001, () => {
  console.log(`Server radi na http://localhost:3001`);
});
