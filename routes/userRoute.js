const express = require("express");
const {
  registerUser,
  loginUser,
  logOutUser,
  forGetPassword,
  resetPassword,
  getUserDetail,
  updatPassword,
  updatUserProfile,
  getAllUsers,
  getSingleUser,
  UpdateUserRole,
  deletUser,
} = require("../controller/userController");
const { isAuthenticatedUSer, authorizeRole } = require("../middleWare/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticatedUSer, logOutUser);

router.route("/me").get(isAuthenticatedUSer, getUserDetail);
router.route("/me/update").put(isAuthenticatedUSer, updatUserProfile);
router.route("/users").get(isAuthenticatedUSer, authorizeRole('Admin'), getAllUsers);
router.route("/users/:userID").get(isAuthenticatedUSer, authorizeRole('Admin'), getSingleUser);
router.route("/users/:userID").delete(isAuthenticatedUSer, authorizeRole('Admin'), deletUser);
router.route("/updateUserRole").post(isAuthenticatedUSer, authorizeRole('Admin'), UpdateUserRole);

router.route("/password/forgetpassword").post(forGetPassword);
router.route("/password/resetpassword/:token").post(resetPassword);
router.route("/password/updatePassowrd").post(isAuthenticatedUSer, updatPassword);

module.exports = router;
