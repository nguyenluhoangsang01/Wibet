import express from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  login,
  logout,
  updatePassword,
  updateUser,
  updateUserById,
} from "../controllers/user.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// @route GET api/user
// @desc Get all users
// @access Private
router.get("/", verifyToken, getAllUsers);

// @route GET api/user/logout
// @desc Logout user
// @access Public
router.get("/logout", logout);

// @route GET api/user/:id
// @desc Get user
// @access Private
router.get("/:id", verifyToken, getUserById);

// @route POST api/user/login
// @desc Login user
// @access Public
router.post("/login", login);

// @route POST api/user
// @desc Register user
// @access Private
router.post("/", verifyToken, createUser);

// @route DELETE api/user/:id
// @desc Delete user
// @access Private
router.delete("/:id", verifyToken, deleteUserById);

// @route PATCH api/user
// @desc Update user logged
// @access Private
router.patch("/", verifyToken, updateUser);

// @route PATCH api/user/:id
// @desc Update user by id
// @access Private
router.patch("/:id", verifyToken, updateUserById);

// @route PATCH api/user/password
// @desc Update password
// @access Private
router.patch("/update/password", verifyToken, updatePassword);

export default router;
