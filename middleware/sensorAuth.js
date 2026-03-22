const deviceAuth = require("./deviceAuth");
const { verifyToken } = require("./authMiddleware");

module.exports = (req, res, next) => {
  if (req.headers["x-device-key"]) {
    return deviceAuth(req, res, next);
  }

  if (req.headers.authorization) {
    return verifyToken(req, res, next);
  }

  return res.status(401).json({
    message: "Unauthorized sensor update request",
  });
};
