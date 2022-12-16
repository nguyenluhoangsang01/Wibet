import express from "express";
import {
	createUser,
	login,
	logout,
	updateUser,
	updateUserById
} from "../controllers/user.js";

const router = express.Router();

// @route POST api/user
// @desc Register user
// @access Private
router.post("/", createUser);

// @route POST api/user/login
// @desc Login user
// @access Public
router.post("/login", login);

// @route PATCH api/user
// @desc Update user logged
// @access Private
router.patch("/", updateUser);

// @route PATCH api/user/:id
// @desc Update user by id
// @access Private
router.patch("/:id", updateUserById);

// @route POST api/user/logout
// @desc Logout user
// @access Private
router.post("/logout", logout);

export default router;
