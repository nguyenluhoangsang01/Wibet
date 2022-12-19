import express from "express";
import { getAllRanking, getRanking } from "../controllers/ranking.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// @route GET api/ranking
// @desc Get all ranking
// @access Private
router.get("/", verifyToken, getAllRanking);

// @route GET api/ranking/:id
// @desc Get ranking
// @access Private
router.get("/:id", verifyToken, getRanking);

export default router;
