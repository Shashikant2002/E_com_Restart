const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} = require("../controller/producrController");
const { isAuthenticatedUSer, authorizeRole } = require("../middleWare/auth");
const router = express.Router();

//For Users
router.route("/products").get(getAllProduct);

//For Admin
router.route("/product/:id").get(getSingleProduct);
router.route("/product/new").post(isAuthenticatedUSer, authorizeRole('Admin'), createProduct);
router.route("/product/:id").put(isAuthenticatedUSer, authorizeRole('Admin'), updateProduct);
router.route("/product/:id").delete(isAuthenticatedUSer, authorizeRole('Admin'), deleteProduct);

module.exports = router;
