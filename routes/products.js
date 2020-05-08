const express = require("express");
const multer = require("multer");
const router = express.Router();
const _ = require("lodash");
const Product = require("../models/product");
// const User = require("../models/user");
const authenticationMiddleWare = require("../middleWares/authentication");
const ownerAuthorizationMiddleWare = require("../middleWares/ownerAuthorization");
const DIR = "./public/";

//Add New Product
router.post("/add", authenticationMiddleWare, async (req, res, next) => {
  const {
    name,
    price,
    discount,
    description,
    category,
    tags,
    image,
  } = req.body;
  const userId = req.user.id;
  debugger;
  const product = new Product({
    name,
    price,
    discount,
    userId,
    description,
    category,
    tags,
    image,
  });
  await product.save();
  res.json({ message: "Added successfully" });
});

//Get All Products Without login
router.get("/", async (req, res, next) => {
  const { page = 1, limit = 9 } = req.query;
  debugger;
  const length = await Product.countDocuments();
  const products = await Product.find()
    .populate("category")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const response = { products, length };
  // const response = products;
  res.send(response);
});
/////////////get by id
router.get("/getProduct/:id", async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate("category");
  // if (!product) throw CustomError("NOT Found", 404);
  res.send(product);
});
//Edit Product
router.patch(
  "/:id",
  authenticationMiddleWare,
  ownerAuthorizationMiddleWare,
  async (req, res, next) => {
    const userId = req.user;
    debugger;
    const productId = req.params.id;
    debugger;
    const {
      name,
      price,
      discount,
      description,
      category,
      tags,
      image,
    } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        discount,
        userId,
        description,
        category: category.id,
        tags,
        image,
      },
      {
        omitUndefined: true,
        new: true,
        runValidators: true,
      }
    );
    console.log(product);
    res.json(product);
  }
);
//Delete Product
router.delete(
  "/:id",
  authenticationMiddleWare,
  ownerAuthorizationMiddleWare,
  async (req, res, next) => {
    debugger;
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    res.json({
      message: "successfuly deleted",
    });
  }
);

// Search  //filter  //sort  //paginate  //
router.get("/search", async (req, res, next) => {
  const { search, category, sortBy, page = 1, limit = 9 } = req.query;

  let result = [];
  if (!category) {
    if (!search) result = await Product.find().populate("category");
    else
      result = await Product.find({
        name: { $regex: new RegExp(".*" + search.toLowerCase() + ".*") },
      }).populate("category");
  } else {
    if (!search) result = await Product.find({ category }).populate("category");
    else {
      result = await Product.find({
        $and: [
          { category },
          { name: { $regex: new RegExp(".*" + search.toLowerCase() + ".*") } },
        ],
      }).populate("category");
    }
  }

  if (sortBy) {
    switch (sortBy) {
      case "name":
        result = _.orderBy(result, "name");
        break;

      case "priceAsc":
        result = _.orderBy(result, ["price"], ["asc"]);
        break;
      case "priceDes":
        result = _.orderBy(result, ["price"], ["desc"]);
        break;
      default:
        break;
    }
  }
  ////////////////////////////////////////////////////////

  const length = result.length;
  if (length > limit) {
    const startIndex = (page - 1) * limit;
    result = result.slice(startIndex, startIndex + limit);
  }

  res.send({ products: result, length });
});
module.exports = router;
