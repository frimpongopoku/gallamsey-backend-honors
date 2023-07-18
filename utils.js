const apiResponse = (response, options) => {
  return response.send({
    error: null,
    code: 200,
    data: null,
    success: !options?.error,
    ...(options || {}),
  });
};

const ERRAND_STATES = {
  DEFAULT: "default",
  STARTED: "started",
  ENGAGING: "engaging",
  COMPLETE: "complete",
  FUNDS_TRANSFERRED: "funds_transferred",
};
module.exports = {
  apiResponse,
  ERRAND_STATES,
};
