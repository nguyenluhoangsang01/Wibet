import express from "express";
import {
  createReward,
  deleteReward,
  getAllRewards,
  getReward,
  updateReward,
} from "../controllers/reward.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyInvalidToken from "../middleware/verifyInvalidToken.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// @route POST api/reward
// @desc Create a new reward
// @access Private
router.post("/", verifyToken, verifyInvalidToken, verifyAdmin, createReward);

// @route GET api/reward
// @desc Get all rewards
// @access Public
router.get("/", getAllRewards);

// @route GET api/reward/:id
// @desc Get reward by id
// @access Public
router.get("/:id", getReward);

// @route DELETE api/reward/:id
// @desc Delete reward with id
// @access Private
router.delete(
  "/:id",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  deleteReward
);

// @route PATCH api/reward/:id
// @desc Update reward with id
// @access Private
router.patch(
  "/:id",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  updateReward
);

export default router;
