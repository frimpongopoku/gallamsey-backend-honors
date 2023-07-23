const { Errand, User } = require("../../db/schema/schema");
const { apiResponse, ERRAND_STATES } = require("../../utils");

const LIMIT = 10;

const serveNews = async (request, response) => {
  const { user_id } = request.body;
  try {
    const user = await User.findOne({ _id: user_id });
    const ignoreProximity = !user?.preferences?.closeToMe;
    const locations = user?.locations;
    let primary = locations?.find((loc) => loc.primary);
    if (locations.length && !primary) primary = locations[0]; // if user has not set primary location yet, first one is the primary location
    if (!user || ignoreProximity || !primary) {
      // Errands that are completed
      const data = await Errand.find({ runner: null })
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
// const serveNewsLocationBased = async (request, response) => {
//   const { user_id } = request.body;
//   try {
//     const jobs = await Errand.find({ status: ERRAND_STATES.DEFAULT })
//       .sort({ createdAt: -1 })
//       .limit(LIMIT);

//     apiResponse(response, { data: jobs });
//   } catch (e) {
//     apiResponse(response, { error: e.toString() });
//   }
// };

module.exports = {
  serveNews,
  // serveNewsLocationBased,
};
