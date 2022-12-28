import express from "express";
import multer from "multer";
import {
	createTeam,
	deleteTeam,
	getAllTeams,
	updateTeam
} from "../controllers/team.js";
import verifyToken from "../middleware/verifyToken.js";

const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();

// @route POST api/team
// @desc Create team
// @access Private
router.post("/", verifyToken, upload.single("image"), createTeam);

// @route POST api/team/:id
// @desc Update team
// @access Private
router.patch("/:id", verifyToken, upload.single("image"), updateTeam);

// @route DELETE api/team/:id
// @desc Delete team
// @access Private
router.delete("/:id", verifyToken, deleteTeam);

// @route GET api/team
// @desc Get all teams
// @access Private
router.get("/", verifyToken, getAllTeams);

export default router;
