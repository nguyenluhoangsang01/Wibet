import express from "express";
import {
  getTheLastSetting,
  refreshSetting,
  updateTheLastSetting,
} from "../controllers/setting.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyInvalidToken from "../middleware/verifyInvalidToken.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// @route POST api/setting
// @desc Refresh setting
// @access Private
router.post("/", verifyToken, verifyInvalidToken, verifyAdmin, refreshSetting);

// @route GET api/setting
// @desc Get the last setting
// @access Private
router.get(
  "/",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  getTheLastSetting
);

// @route PATCH api/setting
// @desc Update the last setting
// @access Private
router.patch(
  "/",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  updateTheLastSetting
);

export default router;
