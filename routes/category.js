const express = require("express");
const router = express.Router();

const Category = require("../models/category");
// const User = require("../models/user");
const authenticationMiddleWare = require("../middleWares/authentication");

router.post("/add", async (req, res, next) => {
  const { name } = req.body;
  debugger;
  const category = new Category({ name });
  await category.save();
  res.json({ message: "category Added successfully" });
});

router.get("/", async (req, res, next) => {
  const categories = await Category.find();
  res.send(categories);
});

module.exports = router;
