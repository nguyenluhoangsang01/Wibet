import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import Reward from "../models/reward.js";

export const createReward = async (req, res, next) => {
  try {
    // Get data from request body
    const { rewardName, numberOfReward, rewardRate } = req.body;

    // Validate not null reward name
    if (!rewardName)
      return sendError(res, "Reward name can not be blank", 400, "rewardName");
    // Find reward name and check if not exists
    const isExistingWithRewardName = await Reward.findOne({ rewardName });
    if (isExistingWithRewardName)
      return sendError(
        res,
        `Reward name ${isExistingWithRewardName.rewardName} has already been taken`,
        400,
        "rewardName"
      );
    // Validate number of reward
    if (!numberOfReward)
      return sendError(
        res,
        "Number of reward can not be blank",
        400,
        "numberOfReward"
      );
    // Check if number of reward is not a number
    if (!Number.isInteger(numberOfReward))
      return sendError(
        res,
        "Number of reward must be an integer",
        400,
        "numberOfReward"
      );
    // Check if number of reward less than 1
    if (numberOfReward < 1)
      return sendError(
        res,
        "Number of reward must be greater than or equal to 1",
        400,
        "numberOfReward"
      );
    // Validate reward rate is null
    if (!rewardRate)
      return sendError(res, "Reward rate can not be blank", 400, "rewardRate");

    // Create a new reward and save it to database
    const newReward = await Reward.create({ ...req.body });
    await newReward.save();

    // Send success notification
    return sendSuccess(res, "Create reward successfully", null, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllRewards = async (req, res, next) => {
  try {
    // Get all rewards
    const rewards = await Reward.find().select("-__v");
    if (!rewards) return sendError(res, "No reward found", 404);

    // Send success notification
    return sendSuccess(res, "Retrieving rewards successfully", rewards);
  } catch (error) {
    next(error);
  }
};

export const getReward = async (req, res, next) => {
  try {
    // Get id from params
    const { id } = req.params;

    //  Get reward by id
    const reward = await Reward.findById(id).select("-__v");
    if (!reward) return sendError(res, "Reward not found", 404);

    // Send success notification
    return sendSuccess(res, "Get reward successfully", reward);
  } catch (error) {
    next(error);
  }
};

export const updateReward = async (req, res, next) => {
  try {
    // Get reward id from request params
    const { id } = req.params;
    // Get data from request body
    const { rewardName, numberOfReward, rewardRate } = req.body;

    // Get reward by id
    const reward = await Reward.findById(id);
    if (!reward) return sendError(res, "Reward not found", 404);

    // Validate not null reward name
    if (!rewardName)
      return sendError(res, "Reward name can not be blank", 400, "rewardName");
    // Find reward name and check if not exists
    const isExistingWithRewardName = await Reward.findOne({
      rewardName: { $ne: reward.rewardName, $eq: rewardName },
    });
    if (isExistingWithRewardName)
      return sendError(
        res,
        `Reward name ${isExistingWithRewardName.rewardName} has already been taken`,
        400,
        "rewardName"
      );
    // Validate number of reward
    if (!numberOfReward)
      return sendError(
        res,
        "Number of reward can not be blank",
        400,
        "numberOfReward"
      );
    // Check if number of reward is not a number
    if (!Number.isInteger(numberOfReward))
      return sendError(
        res,
        "Number of reward must be an integer",
        400,
        "numberOfReward"
      );
    // Validate reward rate is null
    if (!rewardRate)
      return sendError(res, "Reward rate can not be blank", 400, "rewardRate");

    // Find again with id and update
    await Reward.findByIdAndUpdate(id, { ...req.body }, { new: true });

    // Send success notification
    return sendSuccess(res, "Update reward successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteReward = async (req, res, next) => {
  try {
    // Get reward id from request params
    const { id } = req.params;

    // Get reward by id
    const reward = await Reward.findById(id);
    if (!reward) return sendError(res, "Reward not found", 404);

    // Find again and delete it
    await Reward.findByIdAndDelete(id);

    // Send success notification
    return sendSuccess(res, "Delete reward successfully");
  } catch (error) {
    next(error);
  }
};
