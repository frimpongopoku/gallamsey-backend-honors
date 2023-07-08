const { Errand } = require("../../db/schema/schema");
const { apiResponse } = require("../../utils");

const createErrand = (request, response) => {
  const { body } = request;
  const newErrand = new Errand({ ...(body || {}) });

  newErrand
    .save()
    .then(() => apiResponse(response, { data: newErrand }))
    .catch((error) => apiResponse(response, { error: error.toString() }));
};

const updateErrand = (request, response) => {
  const { body } = request;
  const { id, posterId } = body || {};
  Errand.findOneAndUpdate({ _id: id, "poster.id": posterId }, body, { new: true })
    .then((updatedErrand) => {
      apiResponse(response, { data: updatedErrand });
    })
    .catch((error) => {
      apiResponse(response, { error: error.toString() });
    });
};

module.exports = {
  createErrand,
  updateErrand,
};
