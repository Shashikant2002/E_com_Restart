const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} = require("../controller/producrController");
const router = express.Router();

//For Users
router.route("/products").get(getAllProduct);

//For Admin
router.route("/product/new").post(createProduct);
router.route("/product/:id").get(getSingleProduct);
router.route("/product/:id").put(updateProduct);
router.route("/product/:id").delete(deleteProduct);

module.exports = router;
