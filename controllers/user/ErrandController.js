const { Errand, User } = require("../../db/schema/schema");
const { apiResponse, ERRAND_STATES } = require("../../utils");
const {
  generateSentence,
  generateParagraph,
  selectLocation,
  getRandomFullName,
  generateRandomString,
} = require("../factory/factory");
const { firestore } = require("../firebase/config");

const inflateWithErrands = (request, response) => {
  for (let i = 0; i < 20; i++) {
    const loc = selectLocation();
    const errand = {
      title: generateSentence(5) + " - " + loc.name,
      description: generateParagraph(25),
      cost: 14 * (i + 4),
      reward: 12 * (i + 2),
      location: { type: "Point", coordinates: loc.coords },
      images: ["https://unsplash.it/400/400?image=" + i],
      poster: {
        name: getRandomFullName(),
        id: generateRandomString(12),
        image: "https://i.pravatar.cc/150?img=" + i,
        phone: `+1${i}${i} - 0000000000`,
      },
    };
    const newErrand = new Errand(errand);
    newErrand.save();
  }

  return apiResponse(response);
};
const createErrand = (request, response) => {
  const { body } = request;
  const { deliveryLocation, poster } = body;
  var locObj = {};
  if (deliveryLocation) {
    locObj = { location: { type: "Point", coordinates: deliveryLocation } };
  }
  const newErrand = new Errand({ ...(body || {}), ...locObj });
  const total = Number(body?.cost) + Number(body.reward);
  console.log("Adding up teh costs", total);

  newErrand
    .save()
    .then(() => apiResponse(response, { data: newErrand }))
    .catch((error) => apiResponse(response, { error: error.toString() }));

  // Then subtract the amount from the users balance
  User.findOneAndUpdate(
    { _id: poster.id },
    { $inc: { "wallet.balance": -1 * total } },
    { new: true }
  )
    .then((user) => {})
    .catch((e) => console.log("Could not update user", e.toString()));
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

const finishErrand = (request, response) => {
  const { body } = request;
  const { errand_id, runner_id, data, poster_id } = body || {};

  // Here, errrand is updated to funds stransferred state. Then we look for the runner and give them the money
  Errand.findOneAndUpdate({ _id: errand_id, "poster.id": poster_id }, data, {
    new: true,
  })
    .then((errand) => {
      if (!errand)
        return apiResponse(response, { error: "Could not finish errand" });
      const total = errand?.reward + errand?.cost;

      // Look for the runner and transfer the funds
      User.findOneAndUpdate(
        { _id: runner_id },
        { $inc: { "wallet.balance": total } },
        { new: true }
      )
        .then((user) => {})

        .catch((e) => console.log("Could not update runners's amount!", e));

      const obj = errand.toJSON();
      obj._id = errand_id;
      console.log("Sending this total", total);
      propagateToFirestore(errand_id, obj, {
        collectionName: "Errands",
      });

      apiResponse(response, { data: errand });
    })
    .catch((error) => {
      apiResponse(response, { error: error.toString() });
    });
};
const findOneErrand = (request, response) => {
  const { body } = request;
  const { errand_id } = body || {};
  Errand.findOne({ _id: errand_id })
    .then((errand) => {
      apiResponse(response, { data: errand });
    })
    .catch((error) => {
      apiResponse(response, { error: error.toString() });
    });
};
const pickErrand = (request, response) => {
  const { body } = request;
  const { errand_id, runner, cancel, runner_id } = body || {};
  let content = {};
  if (cancel)
    content = {
      query: { _id: errand_id, "runner.id": runner_id },
      data: { runner: null, status: ERRAND_STATES.DEFAULT },
    };
  else content = { query: { _id: errand_id }, data: { runner } };

  Errand.findOneAndUpdate(content.query, content.data, {
    new: true,
  })
    .then((updatedErrand) => {
      if (!updatedErrand)
        return apiResponse(response, { error: "Could not pick errand" });
      const errandObj = updatedErrand.toJSON();
      errandObj._id = errand_id;
      propagateToFirestore(errand_id, errandObj, { collectionName: "Errands" });
      apiResponse(response, { data: updatedErrand });
    })
    .catch((error) => {
      apiResponse(response, { error: error.toString() });
    });
};

const listAllErrands = async (request, response) => {
  const { user_id } = request.body;
  try {
    // errands that people are running for the currently signed in user

    const user = await User.findOne({ _id: user_id });
    const ignoreProximity = !user?.preferences?.closeToMe;
    const primary = user?.locations?.find((loc) => loc.primary);
    if (!user || ignoreProximity || !primary) {
      // Errands that are completed
      const data = await Errand.find({ status: ERRAND_STATES.DEFAULT })
        .limit(10)
        .sort({ createdAt: -1 });

      return apiResponse(response, { count: data.length, data });
    }
    const distance = user?.preferences?.proximityRadius || 10;
    console.log("Lets see primary", primary);
    const errands = await Errand.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: primary.coords, // Mongo reads coords as [long, lat]
          },
          distanceField: "distance", // Field to store the calculated distance
          spherical: true,
          key: "location", // Field containing the location data
          maxDistance: distance * 1000, // Convert km to meters
        },
      },
      {
        $match: {
          runner: null,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return apiResponse(response, { count: errands.length, data: errands });
  } catch (e) {
    apiResponse(response, { error: e.toString() });
  }
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

const propagateToFirestore = (key, data, options) => {
  const { collectionName } = options || {};
  if (!collectionName)
    return console.log("Cant propagate to firestore cos no collectionName");

  const collection = firestore.collection(collectionName || "Errands");
  collection
    .doc(key)
    .set(data)
    .then(() => console.log("Firestore items was saved nicely!!!!"))
    .catch((error) =>
      console.log("Firestore could not save: ", error.toString())
    );
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
      if (!updatedErrand)
        return apiResponse(response, { error: "Could not find errand" });
      const errandObj = updatedErrand.toJSON();
      errandObj._id = errand_id;
      // Now before you send errand as s response, send the errand to firebase collection. If errand already exists, let it update the old one
      propagateToFirestore(errand_id, errandObj, { collectionName: "Errands" });
      // const errandCollection = firestore.collection("Errands");
      // errandCollection
      //   .doc(errand_id)
      //   .set(errandObj)
      //   .then(() => console.log("Firestore items was saved nicely!!!!"))
      //   .catch((error) =>
      //     console.log("Firestore could not save: ", error.toString())
      //   );
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
  listAllErrands,
  inflateWithErrands,
  pickErrand,
  findOneErrand,
  finishErrand,
};
