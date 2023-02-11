const express = require("express");
const {
  registerUser,
  loginUser,
  logOutUser,
  forGetPassword,
  resetPassword,
  getUserDetail,
} = require("../controller/userController");
const { isAuthenticatedUSer } = require("../middleWare/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticatedUSer, logOutUser);

router.route("/me").get(isAuthenticatedUSer, getUserDetail);

router.route("/password/forgetpassword").get(forGetPassword);
router.route("/password/resetpassword/:token").post(resetPassword);

module.exports = router;
