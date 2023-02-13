import express from "express";
import {
  createComment,
  deleteCommentById,
  getAllComments,
  updateCommentById,
} from "../controllers/comment.js";
import verifyInvalidToken from "../middleware/verifyInvalidToken.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// @route POST api/comment
// @desc Create a comment
// @access Private
router.post("/", verifyToken, verifyInvalidToken, createComment);

// @route GET api/comment
// @desc Get all comments
// @access Public
router.get("/", getAllComments);

// @route DELETE api/comment/:id
// @desc Delete a comment
// @access Private
router.delete("/:id", verifyToken, verifyInvalidToken, deleteCommentById);

// @route PATCH api/comment/:id
// @desc Update a comment
// @access Private
router.patch("/:id", verifyToken, verifyInvalidToken, updateCommentById);

export default router;
