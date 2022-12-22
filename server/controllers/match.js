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

    // Check if team 1 equal team 2
    if (team1 === team2) return sendError(res, "Cannot choose the same team");

    // Check if team 1 and team 2 not exists
    const team1IsExisting = await Team.findById(team1);
    const team2IsExisting = await Team.findById(team2);
    if (!team1IsExisting) return sendError(res, "Team 1 not found", 404);
    if (!team2IsExisting) return sendError(res, "Team 2 not found", 404);

    // Find team 1 and team 2 in database
    const matchExistingWithTeam1 = await Match.findOne({ team1 });
    const matchExistingWithTeam2 = await Match.findOne({ team2 });

    // If team 1 and team 2 is existing in database and id of match is existing with team 1 and team 2
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
      .populate("team1 team2", "fullName")
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
      .populate("team1 team2", "fullName flag")
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
      .select("-__v")
      .populate("team1 team2", "fullName flag")
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

    // Find team 1 and team 2 in database
    const matchExistingWithTeam1 = await Match.findOne({ team1 });
    const matchExistingWithTeam2 = await Match.findOne({ team2 });

    // If team 1 and team 2 is existing in database and id of match is existing with team 1 and team 2
    if (
      matchExistingWithTeam1 &&
      matchExistingWithTeam2 &&
      matchExistingWithTeam1._id.toString() ===
        matchExistingWithTeam2._id.toString() &&
      (id.toString() !== matchExistingWithTeam1._id.toString() ||
        id.toString() !== matchExistingWithTeam2._id.toString())
    )
      return sendError(res, "The match already exists.");

    //  Update match
    await Match.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    // Get all matches after created
    const match = await Match.findById(id)
      .populate("team1 team2", "fullName")
      .select("-__v");

    // Send success notification
    return sendSuccess(res, "Update match successfully!", match);
  } catch (error) {
    next(error);
  }
};

export const updateScoreById = async (req, res, next) => {
  try {
    //  Get id from request params
    const { id } = req.params;
    // Get data from request body
    const { resultOfTeam1, resultOfTeam2 } = req.body;

    // Validate
    if (!resultOfTeam1)
      return sendError(res, "Result of team 1 cannot be blank.");
    if (!resultOfTeam2)
      return sendError(res, "Result of team 2 cannot be blank.");

    // Update score
    const match = await Match.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    )
      .populate("team1 team2", "fullName")
      .select("-__v");
    // Check if match not exists
    if (!match) return sendError(res, "Match not found", 404);

    // Send success notification
    return sendSuccess(res, "Update score successfully!", match);
  } catch (error) {
    next(error);
  }
};
