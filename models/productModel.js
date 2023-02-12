const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name."],
    trim: true,
  },

  description: {
    type: String,
    required: [true, "Please Enter Product Description."],
  },

  price: {
    type: Number,
    required: [true, "Please Enter Product Price."],
    maxLength: [8, "Price Cannot Exceed 8 Character."],
  },

  ratings: {
    type: Number,
    default: 0,
  },

  images: [
    {
      publicId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],

  category: {
    type: String,
    required: [true, "Please Enter Product Category."],
  },

  stock: {
    type: Number,
    required: [true, "Please Enter Product Quentity."],
    maxLength: [4, "Price Cannot Exceed 4 Character."],
    default: 1,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: [true, "Please Write Some Comment"],
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
