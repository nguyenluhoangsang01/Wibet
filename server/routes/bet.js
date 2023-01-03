import express from "express";
import {
  createBetById,
  deleteBetById,
  getAllBets,
  getBetById,
  updateBetById,
  withdrawMoney,
} from "../controllers/bet.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// @route POST api/bet/:matchId
// @desc Create bet by match id
// @access Private
router.post("/:matchId", verifyToken, createBetById);

// @route UPDATE api/bet/:betId/:matchId
// @desc Update bet by bet id and match id
// @access Private
router.patch("/:betId/:matchId", verifyToken, updateBetById);

// @route DELETE api/bet/:betId
// @desc Delete bet by bet id and match id
// @access Private
router.delete("/:betId/:matchId", verifyToken, deleteBetById);

// @route GET api/bet/:betId
// @desc Get bet by bet id
// @access Private
// router.get("/:betId/bet", verifyToken, getBetByBetId);

// @route GET api/bet/:matchId
// @desc Get bet by match id
// @access Private
// router.get("/:matchId/match", verifyToken, getBetByMatchId);

// @router GET api/bet/:id
// @desc Get bet by user id
// @access Private
// router.get("/:id", verifyToken, getBetByUserId);

// @route GET api/bet
// @desc Get all bets
// @access Private
router.get("/", verifyToken, getAllBets);

// @route PATCH api/bet/:matchId
// @desc Update money of user when withdraw
// @access Private
router.patch("/:matchId", verifyToken, withdrawMoney);

// @route GET api/bet/:id
// @desc Get bet by id
// @access Private
router.get("/:id", verifyToken, getBetById);

export default router;
