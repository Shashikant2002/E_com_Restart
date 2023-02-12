const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  createProductReview,
  getAllReviews,
  deleteReview,
} = require("../controller/producrController");
const { isAuthenticatedUSer, authorizeRole } = require("../middleWare/auth");
const router = express.Router();

//For Users
router.route("/products").get(getAllProduct);

//For Admin
router.route("/product/:id").get(getSingleProduct);

router
  .route("/product/new")
  .post(isAuthenticatedUSer, authorizeRole("Admin"), createProduct);

router
  .route("/product/:id")
  .put(isAuthenticatedUSer, authorizeRole("Admin"), updateProduct);

router
  .route("/product/:id")
  .delete(isAuthenticatedUSer, authorizeRole("Admin"), deleteProduct);

router.route("/review").put(isAuthenticatedUSer, createProductReview);

router.route("/deleteRivews").delete(isAuthenticatedUSer, deleteReview);

router.route("/getAllReviews").get(getAllReviews);

module.exports = router;
