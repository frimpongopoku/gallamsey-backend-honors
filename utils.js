const apiResponse = (response, options) => {
  return response.send({
    error: null,
    code: 200,
    data: null,
    ...(options || {}),
  });
};
module.exports = {
  apiResponse,
};
