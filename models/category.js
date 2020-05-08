const mongoose = require("mongoose");
const _ = require("lodash");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc) => {
        return _.pick(doc, ["id", "name"]);
      },
    },
  }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
