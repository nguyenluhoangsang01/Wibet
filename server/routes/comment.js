import express from "express";
import multer from "multer";
import {
	createComment,
	deleteCommentById,
	getAllComments,
	updateCommentById
} from "../controllers/comment.js";
import verifyToken from "../middleware/verifyToken.js";

const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();

// @route POST api/comment
// @desc Create a comment
// @access Private
router.post("/", verifyToken, upload.single("image"), createComment);

// @route GET api/comment
// @desc Get all comments
// @access Private
router.get("/", verifyToken, getAllComments);

// @route DELETE api/comment/:id
// @desc Delete a comment
// @access Private
router.delete("/:id", verifyToken, deleteCommentById);

// @route PATCH api/comment/:id
// @desc Update a comment
// @access Private
router.patch("/:id", verifyToken, upload.single("image"), updateCommentById);

export default router;
