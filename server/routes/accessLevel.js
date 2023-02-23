import express from "express";
import {
  createAccessLevel,
  deleteAccessLevel,
  getAccessLevel,
  getAllAccessLevels,
  updateAccessLevel,
} from "../controllers/accessLevel.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyInvalidToken from "../middleware/verifyInvalidToken.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// @route POST api/accessLevel
// @desc Create a new access level
// @access Private
router.post(
  "/",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  createAccessLevel
);

// @route GET api/accessLevel
// @desc Get all access level
// @access Public
router.get("/", getAllAccessLevels);

// @route GET api/accessLevel/:id
// @desc Get access level by id
// @access Public
router.get("/:id", getAccessLevel);

// @route DELETE api/accessLevel/:id
// @desc Delete access level by id
// @access Private
router.delete(
  "/:id",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  deleteAccessLevel
);

// @route PATCH api/accessLevel/:id
// @desc Update access level by id
// @access Private
router.patch(
  "/:id",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  updateAccessLevel
);

export default router;