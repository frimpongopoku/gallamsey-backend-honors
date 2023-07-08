const authenticate = (req, res, next) => {
  // Logic to authenticate the request
  console.log("Authenticating...");
  next();
};

module.exports = { authenticate };
