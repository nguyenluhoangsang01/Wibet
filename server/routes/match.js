import express from "express";
import {
  createMatch,
  deleteMatchById,
  getAllMatches,
  getMatchById,
  updateMatchById,
  updateScoreById,
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

// @route PATCH api/match/:id
// @desc Update match by id
// @access Private
router.patch("/:id", verifyToken, updateMatchById);

// @route PATCH api/match/:id/score
// @desc Update score of match by id
// @access Private
router.patch("/:id/score", verifyToken, updateScoreById);

export default router;
