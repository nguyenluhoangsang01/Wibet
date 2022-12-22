import express from "express";
import {
	createBetById,
	deleteBetById,
	getAllBets,
	getBetById,
	updateBetById,
	withdrawMoney
} from "../controllers/bet.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// @route POST api/bet/:matchId
// @desc Create bet by match id
// @access Private
router.post("/:matchId", verifyToken, createBetById);

// @route UPDATE api/bet/:betId
// @desc Update bet by bet id
// @access Private
router.patch("/:betId/:matchId", verifyToken, updateBetById);

// @route DELETE api/bet/:betId
// @desc Delete bet by bet id
// @access Private
router.delete("/:betId", verifyToken, deleteBetById); //

// @route GET api/bet/:matchId
// @desc Get bet by match id
// @access Private
router.get("/:betId", verifyToken, getBetById); //

// @route GET api/bet
// @desc Get all bets
// @access Private
router.get("/", verifyToken, getAllBets);

// @route PATCH api/bet/:betId
// @desc Update money of user when withdraw
// @access Private
router.patch("/:betId", verifyToken, withdrawMoney);

export default router;
