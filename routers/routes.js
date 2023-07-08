const express = require("express");
const { authenticate } = require("../middlewares/middleware");
const {
  createUser,
  updateUser,
  deleteUser,
  getUser,
} = require("../controllers/user/UserController");
const {
  createErrand,
  updateErrand,
} = require("../controllers/user/ErrandController");
const usersRouter = express.Router();
const errandRouter = express.Router();

usersRouter.get("/:id", getUser);
usersRouter.post("/create", createUser);
usersRouter.post("/update", updateUser);
usersRouter.post("/delete/:id", deleteUser);

errandRouter.post("/create", createErrand);
errandRouter.post("/update", updateErrand);

module.exports = { usersRouter, errandRouter };
