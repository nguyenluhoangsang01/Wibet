import express from "express";
import {
  getTheLastSetting,
  refreshSetting,
  updateBank,
  updateBet,
  updateMoMo,
  updateMoney,
  updatePassword,
  updateRate,
  updateScore,
  updateSkype,
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
// @access Public
router.get("/", getTheLastSetting);

// @route PATCH api/setting/password
// @desc Update password setting
// @access Private
router.patch(
  "/password",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  updatePassword
);

// @route PATCH api/setting/rate
// @desc Update rate setting
// @access Private
router.patch("/rate", verifyToken, verifyInvalidToken, verifyAdmin, updateRate);

// @route PATCH api/setting/bet
// @desc Update bet setting
// @access Private
router.patch("/bet", verifyToken, verifyInvalidToken, verifyAdmin, updateBet);

// @route PATCH api/setting/score
// @desc Update score setting
// @access Private
router.patch(
  "/score",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  updateScore
);

// @route PATCH api/setting/money
// @desc Update money setting
// @access Private
router.patch(
  "/money",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  updateMoney
);

// @route PATCH api/setting/bank
// @desc Update bank setting
// @access Private
router.patch("/bank", verifyToken, verifyInvalidToken, verifyAdmin, updateBank);

// @route PATCH api/setting/moMo
// @desc Update moMo setting
// @access Private
router.patch("/moMo", verifyToken, verifyInvalidToken, verifyAdmin, updateMoMo);

// @route PATCH api/setting/skype
// @desc Update skype setting
// @access Private
router.patch(
  "/skype",
  verifyToken,
  verifyInvalidToken,
  verifyAdmin,
  updateSkype
);

export default router;
