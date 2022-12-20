import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import Match from "../models/match.js";
import Team from "../models/team.js";
import User from "../models/user.js";

export const createBetById = async (req, res, next) => {
  try {
    // Get match id from request params
    const { matchId } = req.params;
    // Get user id from request
    const { userId } = req;
    // Get data from request body
    const { option, money } = req.body;

    // Get user by id
    const user = await User.findById(userId).select("money");
    // Get match by id and check if match not exists
    const match = await Match.findById(matchId).select("-__v");
    if (!match) return sendError(res, "Match not found", 404);

    // Validate
    if (!option) return sendError(res, "Option cannot be blank.");
    if (!money) return sendError(res, "Money cannot be blank.");
    if (money < 50)
      return sendError(res, "Money must be greater than or equal to 50.");
    if (money > Number(user.money))
      return sendError(
        res,
        `Money must be less than or equal to ${user.money}.`
      );

    // Check if team not exists
    const isExistingTeam = await Team.findById(option);
    if (!isExistingTeam) return sendError(res, "Team not found", 404);

    // Check if option is difference between team 1 id and team 2
    if (
      option.toString() !== match.team1.toString() &&
      option.toString() !== match.team2.toString()
    )
      return sendError(res, "The selected team is not valid.");

    // Update money of user
    const updateMoney = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        money: Number(user.money) - money,
      },
      {
        new: true,
      }
    ).select("-__v -password");
    await updateMoney.save();

    // Send success notification
    return sendSuccess(res, "Create bet successfully!", {
      user: updateMoney,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBetById = async (req, res, next) => {};

export const getBetById = async (req, res, next) => {
  try {
    // Get match id from request params
    const { matchId } = req.params;

    // Get match by id
    const match = await Match.findById(matchId)
      .populate("team1 team2", "flag fullName")
      .select("_id team1 team2");
    if (!match) return sendError(res, "Match not found", 404);

    // Send success notification
    return sendSuccess(res, "Get match successfully!", match);
  } catch (error) {
    next(error);
  }
};

export const updateBetById = async (req, res, next) => {};
