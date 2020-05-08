const User = require("../models/user");
const CustomError = require("../helpers/customError");
require("express-async-errors");
module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  debugger;
  if (!token) throw CustomError("not authorization provided", 401);
  const currentUser = await User.generateUserFromToken(token);
  req.user = currentUser;
  next();
};
