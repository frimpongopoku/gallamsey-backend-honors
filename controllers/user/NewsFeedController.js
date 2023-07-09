const { Errand } = require("../../db/schema/schema");
const { apiResponse, ERRAND_STATES } = require("../../utils");

const LIMIT = 50;
const serveNews = async (request, response) => {
  const { user_id } = request.body;

  try {
    const jobs = await Errand.find({ status: ERRAND_STATES.DEFAULT })
      .sort({ createdAt: -1 })
      .limit(LIMIT);

    apiResponse(response, { data: jobs });
  } catch (e) {
    apiResponse(response, { error: e.toString() });
  }

  apiResponse(response, { data: "This is the news feed my gee" });
};

module.exports = {
  serveNews,
};
