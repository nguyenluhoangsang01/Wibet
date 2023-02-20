import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import Setting from "../models/setting.js";

export const refreshSetting = async (req, res, next) => {
  try {
    // Delete previous settings
    await Setting.deleteMany();

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

export const updateTheLastSetting = async (req, res, next) => {
  try {
    const {
      minPassword,
      maxPassword,
      minRate,
      maxRate,
      minBetMoney,
      maxScore,
      defaultMoney,
      wrongPasswordTimes,
      timeUpdateScore,
      timeBet,
    } = req.body;

    // Validate min password
    if (!minPassword && minPassword !== 0)
      return sendError(
        res,
        "Min password can not be blank",
        400,
        "minPassword"
      );
    if (!Number.isInteger(minPassword))
      return sendError(
        res,
        "Min password must be an integer",
        400,
        "minPassword"
      );

    // Validate max password
    if (!maxPassword && maxPassword !== 0)
      return sendError(
        res,
        "Max password can not be blank",
        400,
        "maxPassword"
      );
    if (!Number.isInteger(maxPassword))
      return sendError(
        res,
        "Max password must be an integer",
        400,
        "maxPassword"
      );

    // Validate min rate
    if (!minRate && minRate !== 0)
      return sendError(res, "Min rate can not be blank", 400, "minRate");
    if (!Number.isInteger(minRate))
      return sendError(res, "Min rate must be an integer", 400, "minRate");

    // Validate max rate
    if (!maxRate && maxRate !== 0)
      return sendError(res, "Max rate can not be blank", 400, "maxRate");
    if (!Number.isInteger(maxRate))
      return sendError(res, "Max rate must be an integer", 400, "maxRate");

    // Validate min bet money
    if (!minBetMoney && minBetMoney !== 0)
      return sendError(
        res,
        "Min bet money can not be blank",
        400,
        "minBetMoney"
      );
    if (!Number.isInteger(minBetMoney))
      return sendError(
        res,
        "Min bet money must be an integer",
        400,
        "minBetMoney"
      );

    // Validate max score
    if (!maxScore && maxScore !== 0)
      return sendError(res, "Max score can not be blank", 400, "maxScore");
    if (!Number.isInteger(maxScore))
      return sendError(res, "Max score must be an integer", 400, "maxScore");

    // Validate default money
    if (!defaultMoney && defaultMoney !== 0)
      return sendError(
        res,
        "Default money can not be blank",
        400,
        "defaultMoney"
      );
    if (!Number.isInteger(defaultMoney))
      return sendError(
        res,
        "Default money must be an integer",
        400,
        "defaultMoney"
      );

    // Validate wrong password times
    if (!wrongPasswordTimes && wrongPasswordTimes !== 0)
      return sendError(
        res,
        "Wrong password times can not be blank",
        400,
        "wrongPasswordTimes"
      );
    if (!Number.isInteger(wrongPasswordTimes))
      return sendError(
        res,
        "Wrong password times must be an integer",
        400,
        "wrongPasswordTimes"
      );

    // Validate time to update score
    if (!timeUpdateScore && timeUpdateScore !== 0)
      return sendError(
        res,
        "Time to update score can not be blank",
        400,
        "timeUpdateScore"
      );
    if (!Number.isInteger(timeUpdateScore))
      return sendError(
        res,
        "Time to update score must be an integer",
        400,
        "timeUpdateScore"
      );

    // Validate time to bet
    if (!timeBet && timeBet !== 0)
      return sendError(res, "Time bet can not be blank", 400, "timeBet");
    if (!Number.isInteger(timeBet))
      return sendError(res, "Time bet must be an integer", 400, "timeBet");

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
