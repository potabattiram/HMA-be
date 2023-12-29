function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).send({
      message: "Unauthorized",
      status: false,
      data: "User not authenticated",
    });
  }
}

module.exports = isAuthenticated;
