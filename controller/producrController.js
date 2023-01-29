const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsyncError = require("../utils/chachAsyncError");
const ErrorHandaner = require("../utils/errorHandeler");

// Creating a Product-- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  const { name, description, price, images, category } = req.body;

  if (!name || !description || !price || !images || !category) {
    return next(new ErrorHandaner("Please Fill All the Required Field", 400));
  }

  const product = await Product.create(req.body);
  return res.status(201).json({
    success: true,
    message: product,
  });
});

// Update Product -- Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandaner("Product Not Found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: product,
  });
});

// Get Single Product -- Admin
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandaner("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: product,
  });
});

// Delete Product -- Admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandaner("Product Not Found", 404));
  }
  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfull",
  });
});

// Get All Product
exports.getAllProduct = catchAsyncError(async (req, res) => {
  const resultPerPage = 3;

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagenation(resultPerPage);
  const allProduct = await apiFeature.query;

  res.status(200).json({
    success: true,
    message: allProduct,
  });
});
