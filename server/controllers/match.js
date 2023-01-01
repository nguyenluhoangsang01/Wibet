import moment from "moment/moment.js";
import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import Bet from "../models/bet.js";
import Match from "../models/match.js";
import Team from "../models/team.js";
import User from "../models/user.js";

export const createMatch = async (req, res, next) => {
  try {
    // Get data from request body
    const { team1, team2, matchDate, rate } = req.body;

    // Validate
    if (!team1) return sendError(res, "Team 1 cannot be blank.");
    if (!team2) return sendError(res, "Team 2 cannot be blank.");
    if (!matchDate) return sendError(res, "Match Date cannot be blank.");
    if (!rate) return sendError(res, "Rate cannot be blank.");

    // Check if team 1 equal team 2
    if (team1 === team2) return sendError(res, "Cannot choose the same team");

    // Check if team 1 and team 2 not exists
    const team1IsExisting = await Team.findById(team1);
    const team2IsExisting = await Team.findById(team2);
    if (!team1IsExisting) return sendError(res, "Team 1 not found", 404);
    if (!team2IsExisting) return sendError(res, "Team 2 not found", 404);

    // Find team 1 and team 2 in database
    const matchExistingWithTeam1 = await Match.findOne({
      $or: [{ team1 }, { team2 }],
    });
    const matchExistingWithTeam2 = await Match.findOne({
      $or: [{ team2 }, { team1 }],
    });

    // Check if match date is exists
    if (
      moment(matchExistingWithTeam1?.matchDate).format(
        "HH:mm:ss - yyyy/MM/DD"
      ) === moment(matchDate).format("HH:mm:ss - yyyy/MM/DD") ||
      moment(matchExistingWithTeam2?.matchDate).format(
        "HH:mm:ss - yyyy/MM/DD"
      ) === moment(matchDate).format("HH:mm:ss - yyyy/MM/DD")
    )
      return sendError(
        res,
        "The match date of the match already exists for both teams."
      );

    // Create new match
    const newMatch = await Match.create({ ...req.body });
    await newMatch.save();

    // Get all matches after created
    const matches = await Match.find()
      .populate("team1 team2", "fullName flag name")
      .select("-__v");

    // Send success notification
    return sendSuccess(
      res,
      "Create match successfully!",
      {
        length: matches.length,
        matches,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const deleteMatchById = async (req, res, next) => {
  try {
    // Get id from request params
    const { id } = req.params;

    // Check if match not exits
    const match = await Match.findByIdAndDelete(id);
    // Check if match not found
    if (!match) return sendError(res, "Match not found", 404);

    // Get all matches after delete match
    const matches = await Match.find()
      .populate("team1 team2", "fullName flag name")
      .select("-__v");

    // Send success notification
    return sendSuccess(res, "Delete match successfully!", {
      length: matches.length,
      matches,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMatches = async (req, res, next) => {
  try {
    // Get all matches
    const matches = await Match.find()
      .populate("team1 team2", "fullName flag name")
      .select("-__v");
    // Check if matches not found
    if (!matches) return sendError(res, "No results found", 404);

    // Send notification success
    return sendSuccess(res, "Retrieving matches successfully!", {
      length: matches.length,
      matches,
    });
  } catch (error) {
    next(error);
  }
};

export const getMatchById = async (req, res, next) => {
  try {
    //  Get id from request params
    const { id } = req.params;

    // Check if match not exists
    const match = await Match.findById(id)
      .populate("team1 team2", "fullName flag name")
      .select("-__v");
    if (!match) return sendError(res, sendError("Match not found", 404));

    // Send notification success
    return sendSuccess(res, "Get match successfully!", match);
  } catch (error) {
    next(error);
  }
};

export const updateMatchById = async (req, res, next) => {
  try {
    // Get data from request body
    const { team1, team2, matchDate, rate } = req.body;
    //  Get id from request params
    const { id } = req.params;

    // Validate
    if (!team1) return sendError(res, "Team 1 cannot be blank.");
    if (!team2) return sendError(res, "Team 2 cannot be blank.");
    if (!matchDate) return sendError(res, "Match Date cannot be blank.");
    if (!rate) return sendError(res, "Rate cannot be blank.");

    // Check if team 1 and team 2 not exists
    const team1IsExisting = await Team.findById(team1);
    const team2IsExisting = await Team.findById(team2);
    if (!team1IsExisting) return sendError(res, "Team 1 not found", 404);
    if (!team2IsExisting) return sendError(res, "Team 2 not found", 404);

    //  Update match
    await Match.findByIdAndUpdate(id, { ...req.body }, { new: true });

    // Get all matches after created
    const matches = await Match.find()
      .populate("team1 team2", "fullName flag name")
      .select("-__v");

    // Send success notification
    return sendSuccess(res, "Update match successfully!", {
      length: matches.length,
      matches,
    });
  } catch (error) {
    next(error);
  }
};

export const updateScoreById = async (req, res, next) => {
  try {
    //  Get id from request params
    const { id } = req.params;
    // Get data from request body
    const { resultOfTeam1, resultOfTeam2, autoGenerate, result } = req.body;
    // Get user id from request
    const { userId } = req;

    // Validate
    if (!resultOfTeam1)
      return sendError(res, "Result of team 1 cannot be blank.");
    if (!resultOfTeam2)
      return sendError(res, "Result of team 2 cannot be blank.");

    // Get match by id
    const match = await Match.findById(id)
      .populate("team1 team2", "fullName flag name")
      .select("-__v");
    if (!match) return sendError(res, "Match not found", 404);

    // Get user id from request
    const user = await User.findById(userId).select("-__v -password");
    if (!user) return sendError(res, "User not found", 404);

    // Check if user clock auto generate result
    // Update score
    await Match.findByIdAndUpdate(
      id,
      {
        ...req.body,
        result: autoGenerate
          ? resultOfTeam1 > resultOfTeam2 + match.rate
            ? match.team1.fullName
            : resultOfTeam1 < resultOfTeam2 + match.rate
            ? match.team2.fullName
            : resultOfTeam1 === resultOfTeam2 + match.rate && "Draw"
          : result,
      },
      { new: true }
    )
      .populate("team1 team2", "fullName flag name")
      .select("-__v");

    // Find bet by match id and user id
    const bet = await Bet.where("user")
      .equals(user._id)
      .where("match")
      .equals(match._id)
      .populate("team user", "-__v -password")
      .select("-__v")
      .populate({
        path: "match",
        populate: {
          path: "team1 team2",
          select: "name fullName flag",
        },
        select: "-__v",
      });

    // Update win times of user
    await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        winTimes: bet[0]?.match?.result
          ? bet[0]?.team?.fullName == bet[0]?.match?.result &&
            bet[0]?.match?.result !== "Draw"
            ? user?.winTimes + 1
            : user?.winTimes
          : user?.winTimes,
      },
      { new: true }
    );

    // Send success notification
    return sendSuccess(res, "Update score successfully!");
  } catch (error) {
    next(error);
  }
};
