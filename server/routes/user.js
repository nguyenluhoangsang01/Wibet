import express from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  login,
  logout,
  updateMoneyUserById,
  updatePassword,
  updateProfile,
  updateUser,
  updateUserById,
} from "../controllers/user.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyInvalidToken from "../middleware/verifyInvalidToken.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// @route GET api/user
// @desc Get all users
// @access Public
router.get("/", getAllUsers);

// @route GET api/user/logout
// @desc Logout user
// @access Private
router.get("/logout", verifyToken, verifyInvalidToken, logout);

// @route GET api/user/:id
// @desc Get user
// @access Private
router.get("/:id", verifyToken, verifyInvalidToken, verifyAdmin, getUserById);

// @route POST api/user/login
// @desc Login user
// @access Public
router.post("/login", login);

// @route POST api/user
// @desc Register user
// @access Private
router.post("/", verifyToken, verifyInvalidToken, verifyAdmin, createUser);

// @route DELETE api/user/:id
// @desc Delete user
// @access Private
router.delete(
  "/:id",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  deleteUserById
);

// @route PATCH api/user
// @desc Update user logged
// @access Private
router.patch("/", verifyToken, verifyInvalidToken, verifyAdmin, updateUser);

// @route PATCH api/user/:id
// @desc Update user by id
// @access Private
router.patch(
  "/:id",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  updateUserById
);

// @route PATCH api/user/money/:id
// @desc Update user'money by id
// @access Private
router.patch(
  "/money/:id",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  updateMoneyUserById
);

// @route PATCH api/user/password
// @desc Update password
// @access Private
router.patch(
  "/update/password",
  verifyToken,
  verifyInvalidToken,
  updatePassword
);

// @route PATCH api/user/update/profile
// @desc Update user profile
// @access Private
router.patch("/update/profile", verifyToken, verifyInvalidToken, updateProfile);

export default router;
