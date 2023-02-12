const Order = require("../models/orderModel");
const catchAsyncError = require("../utils/chachAsyncError");
const ErrorHandaner = require("../utils/errorHandeler");
const Product = require("../models/productModel");

// Creating order
exports.createOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (
    (!shippingInfo ||
      !orderItems ||
      !paymentInfo ||
      !itemPrice ||
      !taxPrice ||
      !shippingPrice,
    !totalPrice)
  ) {
    return next(new ErrorHandaner("Please Fill All the Required Field", 400));
  }

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandaner("Please Fill All the Required Field", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get own order / me
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });

  if (!order) {
    return next(new ErrorHandaner("Order Not Found", 404));
  }

  res.status(200).json({
    success: true,
    totalOrder: order.length,
    order,
  });
});

// Get all order
exports.getAllOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.find();

  if (!order) {
    return next(new ErrorHandaner("Order Not Found", 404));
  }

  let totalPrice = 0;

  order.forEach((ele) => {
    totalPrice += ele.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalPrice,
    totalOrder: order.length,
    order,
  });
});

// update order status
exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandaner("Order Not Found", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandaner("You Have already Delivered This order", 404)
    );
  }
  console.log(order.orderItems);

  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quentity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Status updated Successful",
  });
});

async function updateStock(id, quentity) {
  const product = await Product.findById(id);

  product.stock = product.stock - quentity;

  await product.save({ validateBeforeSave: false });
}

// Delete Order
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandaner("Order Not Found", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
