const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
// require("express-async-errors");

const authenticationMiddleWare = require("../middleWares/authentication");
const validationMiddleWare = require("../middleWares/validation");
const CustomError = require("../helpers/customError");
const User = require("../models/user");

router.post(
  "/register",
  validationMiddleWare(
    check("email").isEmail().withMessage("must be an Email Address"),
    check("email").custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
    check("username")
      .isString()
      .withMessage("username must be a string")
      .isLength({ min: 3 })
      .withMessage("must be at least 3 chars long"),
    // check("password").custom((value, { req }) => {
    //   if (value !== req.body.confirmPassword) {
    //     debugger;
    //     throw new Error("Password confirmation is incorrect");
    //   }
    // }),
    check("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("must contain a number")
  ),
  async (req, res, next) => {
    try {
      debugger;
      const { username, password, firstName, email } = req.body;
      const user = new User({
        username,
        password,
        firstName,
        email,
      });
      await user.save();
      res.json({ message: "user was registered successfully" });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

//firstUser:
/////////  email:farah@yahoo.com Password:12345
// second user:
/////////  email:  eman@yahoo.com  Password:1234eman
// second user:
/////////  email:  manar@gmail.com  Password:1234manar
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  // debugger;
  // const userInfo = username != null ? { username: username } : { email: email };

  const user = await User.findOne({ email });

  if (!user) {
    throw CustomError("wrong userName or Password", 401);
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw CustomError("wrong userName or Password", 401);

  const token = await user.generateToken();
  res.json({ user, token });
});

router.patch("/", authenticationMiddleWare, async (req, res, next) => {
  // debugger;
  const id = req.user.id;
  const { username, password, firstName, email, age } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    {
      username,
      password,
      firstName,
      email,
      age,
    },
    {
      omitUndefined: true,
      new: true,
      runValidators: true,
    }
  );
  res.json(user);
});

router.delete("/", authenticationMiddleWare, async (req, res, next) => {
  // debugger;
  const id = req.user.id;
  const user = await User.findByIdAndDelete(id);
  res.json({
    message: "successfuly deleted",
  });
});
module.exports = router;
