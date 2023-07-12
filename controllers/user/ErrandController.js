const { Errand } = require("../../db/schema/schema");
const { apiResponse, ERRAND_STATES } = require("../../utils");
const { firestore } = require("../firebase/config");

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
  const { id, posterId, location } = body || {};

  var locObj = {};
  if (location) {
    locObj = { location: { type: "Point", coordinates: location } };
  }

  Errand.findOneAndUpdate(
    { _id: id, "poster.id": posterId },
    { ...body, ...locObj },
    {
      new: true,
    }
  )
    .then((updatedErrand) => {
      apiResponse(response, { data: updatedErrand });
    })
    .catch((error) => {
      apiResponse(response, { error: error.toString() });
    });
};

const listErrandsForUser = async (request, response) => {
  const { user_id } = request.body;
  try {
    // errands that people are running for the currently signed in user
    const running = await Errand.find({
      "poster.id": user_id,
      status: { $ne: ERRAND_STATES.FUNDS_TRANSFERRED },
    });

    // Errands that are completed
    const past = await Errand.find({
      "poster.id": user_id,
      status: ERRAND_STATES.FUNDS_TRANSFERRED,
    }).sort({ createdAt: -1 });

    apiResponse(response, { data: [...running, ...past] });
  } catch (e) {
    apiResponse(response, { error: e.toString() });
  }
};

const listMyRunningErrands = async (request, response) => {
  const { user_id } = request.body;
  try {
    // errands that the signed in user is currently running
    const running = await Errand.find({
      "runner.id": user_id,
      status: { $ne: ERRAND_STATES.FUNDS_TRANSFERRED },
    });

    // Errands that the currently signed in user is done running
    const past = await Errand.find({
      "runner.id": user_id,
      status: ERRAND_STATES.FUNDS_TRANSFERRED,
    }).sort({ createdAt: -1 });

    apiResponse(response, { data: [...running, ...past] });
  } catch (e) {
    apiResponse(response, { error: e.toString() });
  }
};

// Will be for picking, cancelling, and a
const engageErrand = (request, response) => {
  const { body } = request;
  const { user_id, data, errand_id } = body || {};

  Errand.findOneAndUpdate(
    {
      _id: errand_id,
      $or: [{ "poster.id": user_id }, { "runner.id": user_id }],
    },
    { ...(data || {}) },
    {
      new: true,
    }
  )
    .then((updatedErrand) => {
      console.log("Here it is now", updatedErrand.toJSON());
      const errandObj = updatedErrand.toJSON();
      errandObj._id = errand_id;
      // Now before you send errand as s response, send the errand to firebase collection. If errand already exists, let it update the old one
      const errandCollection = firestore.collection("Errands");
      errandCollection
        .doc(errand_id)
        .set(errandObj)
        .then(() => console.log("Firestore items was saved nicely!!!!"))
        .catch((error) =>
          console.log("Firestore could not save: ", error.toString())
        );
      apiResponse(response, { data: updatedErrand });
    })
    .catch((error) => {
      apiResponse(response, { error: error.toString() });
    });
};

module.exports = {
  createErrand,
  updateErrand,
  listErrandsForUser,
  listMyRunningErrands,
  engageErrand,
};
