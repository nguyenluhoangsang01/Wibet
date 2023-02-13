import express from "express";
import multer from "multer";
import {
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
} from "../controllers/team.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyInvalidToken from "../middleware/verifyInvalidToken.js";
import verifyToken from "../middleware/verifyToken.js";

const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();

// @route POST api/team
// @desc Create team
// @access Private
router.post(
  "/",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  upload.single("image"),
  createTeam
);

// @route POST api/team/:id
// @desc Update team
// @access Private
router.patch(
  "/:id",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  upload.single("image"),
  updateTeam
);

// @route DELETE api/team/:id
// @desc Delete team
// @access Private
router.delete("/:id", verifyToken, verifyInvalidToken, verifyAdmin, deleteTeam);

// @route GET api/team
// @desc Get all teams
// @access Private
router.get("/", verifyToken, verifyInvalidToken, verifyAdmin, getAllTeams);

// @route GET api/team/:id
// @desc Get team by id
// @access Private
router.get("/:id", verifyToken, verifyInvalidToken, verifyAdmin, getTeamById);

export default router;
