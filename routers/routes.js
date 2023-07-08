const express = require("express");
const { authenticate } = require("../middlewares/middleware");
const {
  createUser,
  updateUser,
  deleteUser,
  getUser,
} = require("../controllers/user/UserController");
const usersRouter = express.Router();

usersRouter.get("/:id", getUser);
usersRouter.post("/create", createUser);
usersRouter.post("/update", updateUser);
usersRouter.post("/delete/:id", deleteUser);

module.exports = { usersRouter };
