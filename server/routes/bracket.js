import express from "express";
import {
	createBracket,
	deleteBracketById,
	getAllBrackets,
	updateBracketById
} from "../controllers/bracket.js";

const router = express.Router();

// @route POST api/bracket
// @desc Create bracket
// @desc Public
router.post("/", createBracket);

// @route GET api/bracket
// @desc Get all brackets
// @desc Public
router.get("/", getAllBrackets);

// @route DELETE api/bracket/:id
// @desc Delete bracket by id
// @desc Public
router.delete("/:id", deleteBracketById);

// @route PATCH api/bracket/:id
// @desc Update bracket by id
// @desc Public
router.patch("/:id", updateBracketById);

export default router;
