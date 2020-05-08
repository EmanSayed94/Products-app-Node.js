const mongoose = require("mongoose");
const validator = require("validator");

const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

const saltRounds = 7;
const jwtSecret = process.env.JWT_SECRET;
const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 15,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: (v) => {
        return validator.isEmail(v);
      },
    },
  },
  {
    toJASON: {
      virtuals: true,
      transform: (doc) => {
        return _.pick(doc, ["id", "name", "firstName", "email"]);
      },
    },
  }
);

userSchema.pre("save", async function () {
  const userInstance = this;
  if (this.isModified("password")) {
    userInstance.password = await bcrypt.hash(
      userInstance.password,
      saltRounds
    );
  }
});
userSchema.methods.comparePassword = function (plainPassword) {
  const userInstance = this;
  return bcrypt.compare(plainPassword, userInstance.password);
};

userSchema.methods.generateToken = function () {
  const userInstance = this;
  return sign({ userId: userInstance.id }, jwtSecret);
};

userSchema.statics.generateUserFromToken = async function (token) {
  const User = this;
  const payload = await verify(token, jwtSecret);
  const currentUser = await User.findById(payload.userId);
  if (!currentUser) throw new Error("user Not Found");
  return currentUser;
};

// userSchema.virtual("products", {
//   ref: "Product",
//   localField: "_id",
//   foreignField: "userId",
//   options: { limit: 10 },
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
