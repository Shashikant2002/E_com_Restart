const express = require("express");
const {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/orderController");
const router = express.Router();
const { isAuthenticatedUSer, authorizeRole } = require("../middleWare/auth");

router.route("/createOrder").post(isAuthenticatedUSer, createOrder);
router
  .route("/singleOrder/:id")
  .get(isAuthenticatedUSer, authorizeRole("Admin"), getSingleOrder);
router.route("/myOrders").get(isAuthenticatedUSer, myOrders);
router
  .route("/allOrder")
  .get(isAuthenticatedUSer, authorizeRole("Admin"), getAllOrder);

router
  .route("/updateOrderStatus/:id")
  .post(isAuthenticatedUSer, authorizeRole("Admin"), updateOrderStatus);

router
  .route("/deleteOrder/:id")
  .delete(isAuthenticatedUSer, authorizeRole("Admin"), deleteOrder);

module.exports = router;
