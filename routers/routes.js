const express = require("express");
const { authenticate } = require("../middlewares/middleware");
const {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  fetchUser,
} = require("../controllers/user/UserController");
const {
  createErrand,
  updateErrand,
  listErrandsForUser,
  listMyRunningErrands,
  engageErrand,
  listAllErrands,
} = require("../controllers/user/ErrandController");
const { serveNews } = require("../controllers/user/NewsFeedController");
const usersRouter = express.Router();
const errandRouter = express.Router();
const newsRouter = express.Router();

usersRouter.get("/:id", getUser);
usersRouter.post("/whoami", fetchUser);
usersRouter.post("/create", createUser);
usersRouter.post("/update", updateUser);
usersRouter.post("/delete/:id", deleteUser);

errandRouter.post("/create", createErrand);
errandRouter.post("/update", updateErrand);
errandRouter.post("/list", listAllErrands);
errandRouter.post("/list.mine", listErrandsForUser);
errandRouter.post("/list.running", listMyRunningErrands);
errandRouter.post("/engage", engageErrand);

newsRouter.get("/feed", serveNews);

module.exports = { usersRouter, errandRouter, newsRouter };
