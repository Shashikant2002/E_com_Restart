const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsyncError = require("../utils/chachAsyncError");
const ErrorHandaner = require("../utils/errorHandeler");

// Creating a Product-- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
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
    product,
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
exports.getAllProduct = catchAsyncError(async (req, res, next) => {

  // return next(new ErrorHandaner("Testing", 404));

  const resultPerPage = 6;
  const productCount = await Product.countDocuments();
  let apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;
  const filteredProduct = products.length;

  apiFeature.pagenation(resultPerPage);

  products = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    productCount,
    products,
    resultPerPage,
    filteredProduct
  });
});

// Create New Review and update the Review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId, avtar } = req.body;

  if (!rating || !comment || !productId) {
    return next(new ErrorHandaner("Fill All The Field", 400));
  }

  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    avtar
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandaner("Product Not Found", 404));
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((ele) => {
      if (ele.user.toString() === ele.user._id.toString()) {
        ele.rating = rating;
        ele.comment = comment;
        ele.avtar = avtar;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((ele) => {
    avg += ele.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Reviews Added Successful",
  });
});

// Get All Reviews of all Product
exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandaner("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.proId);

  if (!product) {
    return next(new ErrorHandaner("Product Not Found", 404));
  }

  const reviews = product.reviews.filter(
    (pro) => pro._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviews.forEach((ele) => {
    avg = avg + ele.rating;
  });

  console.log(reviews);
  const ratings = avg / product.reviews.length;

  const numOfReviews = reviews.length;


  await Product.findByIdAndUpdate(
    req.query.proId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review is Deleted Successfull",
  });
});
