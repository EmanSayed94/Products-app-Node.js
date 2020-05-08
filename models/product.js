const mongoose = require("mongoose");
const _ = require("lodash");
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
    },
    category: { type: mongoose.ObjectId, ref: "Category", required: true },
    tags: [String],
    image: {
      type: String,
    },
    userId: { type: mongoose.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc) => {
        return _.pick(doc, [
          "id",
          "name",
          "price",
          "discount",
          "userId",
          "description",
          "category",
          "tags",
          "image",
        ]);
      },
    },
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
