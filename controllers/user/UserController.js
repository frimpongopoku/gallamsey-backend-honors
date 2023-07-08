const { User } = require("../../db/schema/schema");

// controllers/users.js
const getUser = (request, res) => {
  // Logic to retrieve a user
  const { id } = request.params;
  res.send("Get user" + id);
};

const createUser = (request, res) => {
  const { name, email } = request.body;
  const newUser = new User({ email, name });
  newUser
    .save()
    .then(() => console.log("Content saved successfully!"))
    .catch((error) => console.log("Something happened" + error.toString()));
  // Logic to create a new user
  res.send(newUser);
};

const updateUser = (req, res) => {
  // Logic to update a user
  res.send("Update user");
};

const deleteUser = (req, res) => {
  // Logic to delete a user
  res.send("Delete user");
};

module.exports = { getUser, createUser, updateUser, deleteUser };
