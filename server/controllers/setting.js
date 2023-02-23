import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import AccessLevel from "../models/accessLevel.js";
import Reward from "../models/reward.js";
import Setting from "../models/setting.js";

export const refreshSetting = async (req, res, next) => {
  try {
    // Delete previous settings
    await Setting.deleteMany();
    await Reward.deleteMany();
    await AccessLevel.deleteMany();

    // Create with default values
    await Setting.create({});

    // Get all settings
    const settings = await Setting.find().select("-__v");
    // Check if settings not found
    if (!settings) return sendError(res, "No settings found", 400);

    // Send success notification with the last setting
    return sendSuccess(
      res,
      "Refresh settings successfully",
      settings[settings.length - 1]
    );
  } catch (error) {
    next(error);
  }
};

export const getTheLastSetting = async (req, res, next) => {
  try {
    // Get all settings
    const settings = await Setting.find().select("-__v");
    // Check if settings not found
    if (!settings) return sendError(res, "No settings found", 400);

    // Send success notification with the last setting
    return sendSuccess(
      res,
      "Retrieved setting successfully",
      settings[settings.length - 1]
    );
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { minPassword, maxPassword, wrongPasswordTimes } = req.body;

    const validate = (cst, text1, text2, text3, number) => {
      if (!cst && cst !== 0) return sendError(res, text1, 400, cst);

      if (text2) {
        if (!Number.isInteger(cst)) return sendError(res, text2, 400, cst);
      }

      if (text3) {
        if (cst < number) return sendError(res, text3, 400, cst);
      }
    };

    // Validate min password
    validate(
      minPassword,
      "Min password can not be blank",
      "Min password is not a valid number",
      "Min password must be greater than or equal to 3",
      3
    );

    // Validate max password
    validate(
      maxPassword,
      "Max password can not be blank",
      "Max password is not a valid number",
      "Max password must be greater than or equal to 3",
      3
    );

    if (minPassword > maxPassword)
      return sendError(
        res,
        "Min password must be less than max password",
        400,
        "minPassword"
      );

    // Validate wrong password times
    validate(
      wrongPasswordTimes,
      "Wrong password times can not be blank",
      "Wrong password times is not a valid number",
      "Wrong password times must be greater than or equal to 0",
      0
    );

    // Get all settings
    const settings = await Setting.find().select("-__v");
    // Check if not found settings
    if (!settings) return sendError(res, "No settings found", 400);
    // Get the last setting
    const lastSetting = settings[settings.length - 1];

    // Update setting with if of the last setting after validate
    await Setting.findByIdAndUpdate(
      lastSetting._id,
      { ...req.body },
      { new: true }
    );

    // Send success notification
    return sendSuccess(res, "Update setting successfully");
  } catch (error) {
    next(error);
  }
};

export const updateRate = async (req, res, next) => {
  try {
    const { minRate, maxRate } = req.body;

    const validate = (cst, text1, text2, text3, number, text4) => {
      if (!cst && cst !== 0) return sendError(res, text1, 400, cst);

      if (text2) {
        if (!Number.isInteger(cst)) return sendError(res, text2, 400, cst);
      }

      if (text3) {
        if (cst < number) return sendError(res, text3, 400, cst);
      }
    };

    // Validate min rate
    validate(
      minRate,
      "Min rate can not be blank",
      "Min rate is not a valid number",
      "Min rate must be greater than or equal to 0",
      0
    );

    // Validate max rate
    validate(
      maxRate,
      "Max rate can not be blank",
      "Max rate is not a valid number",
      "Max rate must be greater than or equal to 0",
      0
    );

    if (minRate > maxRate)
      return sendError(
        res,
        "Min rate must be less than max rate",
        400,
        "minRate"
      );

    // Get all settings
    const settings = await Setting.find().select("-__v");
    // Check if not found settings
    if (!settings) return sendError(res, "No settings found", 400);
    // Get the last setting
    const lastSetting = settings[settings.length - 1];

    // Update setting with if of the last setting after validate
    await Setting.findByIdAndUpdate(
      lastSetting._id,
      { ...req.body },
      { new: true }
    );

    // Send success notification
    return sendSuccess(res, "Update setting successfully");
  } catch (error) {
    next(error);
  }
};

export const updateBet = async (req, res, next) => {
  try {
    const { minBetMoney, timeBet } = req.body;

    const validate = (cst, text1, text2, text3, number, text4) => {
      if (!cst && cst !== 0) return sendError(res, text1, 400, cst);

      if (text2) {
        if (!Number.isInteger(cst)) return sendError(res, text2, 400, cst);
      }

      if (text3) {
        if (cst < number) return sendError(res, text3, 400, cst);
      }
    };

    // Validate min bet money
    validate(
      minBetMoney,
      "Min bet money can not be blank",
      "Min bet money is not a valid number",
      "Min bet must be greater than or equal to 1",
      1
    );

    // Validate time to bet
    validate(
      timeBet,
      "Time to bet can not be blank",
      "Time to bet is not a valid number",
      "Time to bet must be greater than or equal to 0",
      0
    );

    // Get all settings
    const settings = await Setting.find().select("-__v");
    // Check if not found settings
    if (!settings) return sendError(res, "No settings found", 400);
    // Get the last setting
    const lastSetting = settings[settings.length - 1];

    // Update setting with if of the last setting after validate
    await Setting.findByIdAndUpdate(
      lastSetting._id,
      { ...req.body },
      { new: true }
    );

    // Send success notification
    return sendSuccess(res, "Update setting successfully");
  } catch (error) {
    next(error);
  }
};

export const updateScore = async (req, res, next) => {
  try {
    const { maxScore, timeUpdateScore } = req.body;

    const validate = (cst, text1, text2, text3, number, text4) => {
      if (!cst && cst !== 0) return sendError(res, text1, 400, cst);

      if (text2) {
        if (!Number.isInteger(cst)) return sendError(res, text2, 400, cst);
      }

      if (text3) {
        if (cst < number) return sendError(res, text3, 400, cst);
      }
    };

    // Validate max score
    validate(
      maxScore,
      "Max score can not be blank",
      "Max score is not a valid number",
      "Max score must be greater than or equal to 0",
      0
    );

    // Validate time to update score
    validate(
      timeUpdateScore,
      "Time to update score can not be blank",
      "Time to update score is not a valid number",
      "Time to update score must be greater than or equal to 0",
      0
    );

    // Get all settings
    const settings = await Setting.find().select("-__v");
    // Check if not found settings
    if (!settings) return sendError(res, "No settings found", 400);
    // Get the last setting
    const lastSetting = settings[settings.length - 1];

    // Update setting with if of the last setting after validate
    await Setting.findByIdAndUpdate(
      lastSetting._id,
      { ...req.body },
      { new: true }
    );

    // Send success notification
    return sendSuccess(res, "Update setting successfully");
  } catch (error) {
    next(error);
  }
};

export const updateMoney = async (req, res, next) => {
  try {
    const { defaultMoney } = req.body;

    const validate = (cst, text1, text2, text3, number, text4) => {
      if (!cst && cst !== 0) return sendError(res, text1, 400, cst);

      if (text2) {
        if (!Number.isInteger(cst)) return sendError(res, text2, 400, cst);
      }

      if (text3) {
        if (cst < number) return sendError(res, text3, 400, cst);
      }
    };

    // Validate default money
    validate(
      defaultMoney,
      "Default money can not be blank",
      "Default money is not a valid number",
      "Default money must be greater than or equal to 0",
      0
    );

    // Get all settings
    const settings = await Setting.find().select("-__v");
    // Check if not found settings
    if (!settings) return sendError(res, "No settings found", 400);
    // Get the last setting
    const lastSetting = settings[settings.length - 1];

    // Update setting with if of the last setting after validate
    await Setting.findByIdAndUpdate(
      lastSetting._id,
      { ...req.body },
      { new: true }
    );

    // Send success notification
    return sendSuccess(res, "Update setting successfully");
  } catch (error) {
    next(error);
  }
};

export const updateBank = async (req, res, next) => {
  try {
    const { nameOfBank, stkOfBank, bank, contentOfBank, noteOfBank } = req.body;

    const validate = (cst, text1, text2, text3, number, text4) => {
      if (!cst && cst !== 0) return sendError(res, text1, 400, cst);

      if (text2) {
        if (!Number.isInteger(cst)) return sendError(res, text2, 400, cst);
      }

      if (text3) {
        if (cst < number) return sendError(res, text3, 400, cst);
      }
    };

    // Validate Name of bank
    validate(nameOfBank, "Name of bank can not be blank");

    // Validate Bank account number
    validate(stkOfBank, "Bank account number can not be blank");

    // Validate Bank
    validate(bank, "Bank can not be blank");

    // Validate Content of bank
    validate(contentOfBank, "Transfer content can not be blank");

    // Validate Note of bank
    validate(noteOfBank, "Note of bank can not be blank");

    // Get all settings
    const settings = await Setting.find().select("-__v");
    // Check if not found settings
    if (!settings) return sendError(res, "No settings found", 400);
    // Get the last setting
    const lastSetting = settings[settings.length - 1];

    // Update setting with if of the last setting after validate
    await Setting.findByIdAndUpdate(
      lastSetting._id,
      { ...req.body },
      { new: true }
    );

    // Send success notification
    return sendSuccess(res, "Update setting successfully");
  } catch (error) {
    next(error);
  }
};

export const updateMoMo = async (req, res, next) => {
  try {
    const { numberOfMoMo, nameOfMoMo, contentOfMoMo, noteOfMoMo } = req.body;

    const validate = (cst, text1, text2, text3, number, text4) => {
      if (!cst && cst !== 0) return sendError(res, text1, 400, cst);

      if (text2) {
        if (!Number.isInteger(cst)) return sendError(res, text2, 400, cst);
      }

      if (text3) {
        if (cst < number) return sendError(res, text3, 400, cst);
      }
    };

    // Validate MoMo account number
    validate(numberOfMoMo, "MoMo account number can not be blank");

    // Validate MoMo account name
    validate(nameOfMoMo, "MoMo account name can not be blank");

    // Validate Transfer content
    validate(contentOfMoMo, "Transfer content can not be blank");

    // Validate Note of MoMo
    validate(noteOfMoMo, "Note of MoMo can not be blank");

    // Get all settings
    const settings = await Setting.find().select("-__v");
    // Check if not found settings
    if (!settings) return sendError(res, "No settings found", 400);
    // Get the last setting
    const lastSetting = settings[settings.length - 1];

    // Update setting with if of the last setting after validate
    await Setting.findByIdAndUpdate(
      lastSetting._id,
      { ...req.body },
      { new: true }
    );

    // Send success notification
    return sendSuccess(res, "Update setting successfully");
  } catch (error) {
    next(error);
  }
};

export const updateSkype = async (req, res, next) => {
  try {
    const { skypeName, skypeLink } = req.body;

    const validate = (cst, text1, text2, text3, number, text4) => {
      if (!cst && cst !== 0) return sendError(res, text1, 400, cst);

      if (text2) {
        if (!Number.isInteger(cst)) return sendError(res, text2, 400, cst);
      }

      if (text3) {
        if (cst < number) return sendError(res, text3, 400, cst);
      }
    };

    // Validate Skype name
    validate(skypeName, "Skype name can not be blank");

    // Validate Skype link
    validate(skypeLink, "Skype link can not be blank");

    // Get all settings
    const settings = await Setting.find().select("-__v");
    // Check if not found settings
    if (!settings) return sendError(res, "No settings found", 400);
    // Get the last setting
    const lastSetting = settings[settings.length - 1];

    // Update setting with if of the last setting after validate
    await Setting.findByIdAndUpdate(
      lastSetting._id,
      { ...req.body },
      { new: true }
    );

    // Send success notification
    return sendSuccess(res, "Update setting successfully");
  } catch (error) {
    next(error);
  }
};