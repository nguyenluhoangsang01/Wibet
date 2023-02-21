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
      nameOfBank,
      stkOfBank,
      bank,
      contentOfBank,
      noteOfBank,
      numberOfMoMo,
      nameOfMoMo,
      contentOfMoMo,
      noteOfMoMo,
      skypeName,
      skypeLink,
    } = req.body;

    const validate = (cst, text1, text2) => {
      if (!cst && cst !== 0) return sendError(res, text1, 400, cst);

      if (text2) {
        if (!Number.isInteger(cst)) return sendError(res, text2, 400, cst);
      }
    };

    // Validate min password
    validate(
      minPassword,
      "Min password can not be blank",
      "Min password must be an integer"
    );

    // Validate max password
    validate(
      maxPassword,
      "Max password can not be blank",
      "Max password must be an integer"
    );

    // Validate min rate
    validate(
      minRate,
      "Min rate can not be blank",
      "Min rate must be an integer"
    );

    // Validate max rate
    validate(
      maxRate,
      "Max rate can not be blank",
      "Max rate must be an integer"
    );

    // Validate min bet money
    validate(
      minBetMoney,
      "Min bet money can not be blank",
      "Min bet money must be an integer"
    );

    // Validate max score
    validate(
      maxScore,
      "Max score can not be blank",
      "Max score must be an integer"
    );

    // Validate default money
    validate(
      defaultMoney,
      "Default money can not be blank",
      "Default money must be an integer"
    );

    // Validate wrong password times
    validate(
      wrongPasswordTimes,
      "Wrong password times can not be blank",
      "Wrong password times must be an integer"
    );

    // Validate time to update score
    validate(
      timeUpdateScore,
      "Time to update score can not be blank",
      "Time to update score must be an integer"
    );

    // Validate time to bet
    validate(
      timeBet,
      "Time bet can not be blank",
      "Time bet must be an integer"
    );

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

    // Validate MoMo account number
    validate(numberOfMoMo, "MoMo account number can not be blank");

    // Validate MoMo account name
    validate(nameOfMoMo, "MoMo account name can not be blank");

    // Validate Transfer content
    validate(contentOfMoMo, "Transfer content can not be blank");

    // Validate Note of MoMo
    validate(noteOfMoMo, "Note of MoMo can not be blank");

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
