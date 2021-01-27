const redisClient = require("../Controllers/authenticationAndSessions").redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json("Unauthorized access");
  }

  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      res.status(400).json("Unauthorized access");
    }
    return next();
  });
};

module.exports = {
    requireAuth
}
