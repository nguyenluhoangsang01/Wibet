import express from "express";
import {
  createMatch,
  deleteMatchById,
  getAllMatches,
  getMatchById,
} from "../controllers/match.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// @route POST api/match
// @desc Create match
// @access Private
router.post("/", verifyToken, createMatch);

// @route DELETE api/match/:id
// @desc Delete match by id
// @access Private
router.delete("/:id", verifyToken, deleteMatchById);

// @route GET api/match
// @desc Get all matches
// @access Private
router.get("/", verifyToken, getAllMatches);

// @route GET api/match/:id
// @desc Get match by id
// @access Private
router.get("/:id", verifyToken, getMatchById);

export default router;
