import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import Match from "../models/match.js";
import Team from "../models/team.js";

export const createMatch = async (req, res, next) => {
  try {
    // Get data from request body
    const { team1, team2, matchDate, rate } = req.body;

    // Validate
    if (!team1) return sendError(res, "Team 1 cannot be blank.");
    if (!team2) return sendError(res, "Team 2 cannot be blank.");
    if (!matchDate) return sendError(res, "Match Date cannot be blank.");
    if (!rate) return sendError(res, "Rate cannot be blank.");

    const team1IsExisting = await Team.findById(team1);
    const team2IsExisting = await Team.findById(team2);
    if (!team1IsExisting) return sendError(res, "Team 1 not found", 404);
    if (!team2IsExisting) return sendError(res, "Team 2 not found", 404);

    const matchExistingWithTeam1 = await Match.findOne({ team1 });
    const matchExistingWithTeam2 = await Match.findOne({ team2 });

    if (
      matchExistingWithTeam1 &&
      matchExistingWithTeam2 &&
      matchExistingWithTeam1._id.toString() ===
        matchExistingWithTeam2._id.toString()
    )
      return sendError(res, "The match already exists.");

    // Create new match
    const newMatch = await Match.create({ ...req.body });
    await newMatch.save();

    // Get all matches after created
    const matches = await Match.find()
      .populate("team1 team2", "fullName")
      .select("-__v");

    // Send success notification
    return sendSuccess(res, "Success", matches);
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
    if (!match) return sendError(res, "Match not found", 404);

    // Get all matches after delete match
    const matches = await Match.find().select("-__v");

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
      .populate("team1 team2", "fullName")
      .select("-__v");
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
    // Get id from params
    const { id } = req.params;

    // Check if match not exists
    const match = await Match.findById(id).select("-__v");
    if (!match) return sendError(res, sendError("Match not found", 404));

    // Send notification success
    return sendSuccess(res, "Get match successfully!", match);
  } catch (error) {
    next(error);
  }
};
