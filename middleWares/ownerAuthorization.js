// module
const Product = require("../models/product");
const CustomError = require("../helpers/customError");
module.exports = async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.id;
  debugger;
  const product = await Product.findById(productId);
  if (!product.userId.equals(userId)) {
    throw CustomError("Not Authorized", 403);
  }
  next();
};
