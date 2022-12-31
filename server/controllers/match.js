import moment from "moment/moment.js";
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
    const matchExistingWithTeam1 = await Match.findOne({
      $or: [{ team1 }, { team2 }],
    });
    const matchExistingWithTeam2 = await Match.findOne({
      $or: [{ team2 }, { team1 }],
    });

    // Check if match date is exists
    if (
      moment(matchExistingWithTeam1?.matchDate).format(
        "hh:mm:ss - yyyy/MM/DD"
      ) === moment(matchDate).format("hh:mm:ss - yyyy/MM/DD") ||
      moment(matchExistingWithTeam2?.matchDate).format(
        "hh:mm:ss - yyyy/MM/DD"
      ) === moment(matchDate).format("hh:mm:ss - yyyy/MM/DD")
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
    const { resultOfTeam1, resultOfTeam2, autoGenerate } = req.body;

    // Validate
    if (!resultOfTeam1)
      return sendError(res, "Result of team 1 cannot be blank.");
    if (!resultOfTeam2)
      return sendError(res, "Result of team 2 cannot be blank.");

    // Get match by id
    const getMatch = await Match.findById(id)
      .populate("team1 team2", "fullName flag name")
      .select("-__v");

    // Check if user clock auto generate result
    if (autoGenerate) {
      // Update score
      const match = await Match.findByIdAndUpdate(
        id,
        {
          ...req.body,
          result:
            resultOfTeam1 > resultOfTeam2 + getMatch.rate
              ? getMatch.team1.fullName
              : resultOfTeam1 < resultOfTeam2 + getMatch.rate
              ? getMatch.team2.fullName
              : resultOfTeam1 === resultOfTeam2 + getMatch.rate && "Draw",
        },
        { new: true }
      )
        .populate("team1 team2", "fullName flag name")
        .select("-__v");
      // Check if match not exists
      if (!match) return sendError(res, "Match not found", 404);

      // Send success notification
      return sendSuccess(res, "Update score successfully!");
    } else {
      // Update score
      const match = await Match.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      )
        .populate("team1 team2", "fullName flag name")
        .select("-__v");

      // Check if match not exists
      if (!match) return sendError(res, "Match not found", 404);

      // Send success notification
      return sendSuccess(res, "Update score successfully!");
    }
  } catch (error) {
    next(error);
  }
};
