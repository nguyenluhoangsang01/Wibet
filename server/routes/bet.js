import express from "express";
import {
  createBetById,
  deleteBetById,
  getAllBets,
  getBetById,
  updateBetById,
  withdrawMoney,
} from "../controllers/bet.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyInvalidToken from "../middleware/verifyInvalidToken.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// @route POST api/bet/:matchId
// @desc Create bet by match id
// @access Private
router.post("/:matchId", verifyToken, verifyInvalidToken, createBetById);

// @route UPDATE api/bet/:betId/:matchId
// @desc Update bet by bet id and match id
// @access Private
router.patch(
  "/:betId/:matchId",
  verifyToken,
  verifyInvalidToken,
  updateBetById
);

// @route DELETE api/bet/:betId
// @desc Delete bet by bet id and match id
// @access Private
router.delete(
  "/:betId/:matchId",
  verifyToken,
  verifyInvalidToken,
  deleteBetById
);

// @route GET api/bet
// @desc Get all bets
// @access Private
router.get("/", verifyToken, verifyInvalidToken, getAllBets);

// @route PATCH api/bet/:matchId
// @desc Update money of user when withdraw
// @access Private
router.patch(
  "/:matchId",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  withdrawMoney
);

// @route GET api/bet/:id
// @desc Get bet by id
// @access Private
router.get("/:id", getBetById);

export default router;
