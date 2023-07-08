const { User } = require("../../db/schema/schema");
const { apiResponse } = require("../../utils");

// controllers/users.js
const getUser = (request, response) => {
  // Logic to retrieve a user
  const { id } = request.params;
  response.send("Get user" + id);
};

const createUser = (request, response) => {
  const { body } = request;
  const newUser = new User({ ...(body || {}) });
  newUser
    .save()
    .then(() => apiResponse(response, { data: newUser }))
    .catch((error) => apiResponse(response, { error: error.toString() }));
};

const updateUser = (request, response) => {
  const { body } = request;
  const { id } = body || {};
  User.findByIdAndUpdate(id, body, { new: true })
    .then((updatedUser) => {
      apiResponse(response, { data: updatedUser });
    })
    .catch((error) => {
      apiResponse(response, { error: error.toString() });
    });
};

const deleteUser = (req, res) => {
  // Logic to delete a user
  res.send("Delete user");
};

module.exports = { getUser, createUser, updateUser, deleteUser };
