import express from "express";
import { createBracket } from "../controllers/bracket.js";

const router = express.Router();

// @route POST api/bracket
// @desc Create bracket
// @desc Public
router.post("/", createBracket);

export default router;
