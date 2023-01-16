import moment from "moment/moment.js";
import { formatTime } from "../constants.js";
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
    if (!team1) return sendError(res, "Team 1 cannot be blank", 400, "team1");
    // Check if team 1 not exists
    const team1IsExisting = await Team.findById(team1);
    if (!team1IsExisting)
      return sendError(res, "Team 1 not found", 404, "team1");
    // Check if team 2 not exists
    if (!team2) return sendError(res, "Team 2 cannot be blank", 400, "team2");
    const team2IsExisting = await Team.findById(team2);
    if (!team2IsExisting)
      return sendError(res, "Team 2 not found", 404, "team2");

    // Check if team 1 equal team 2
    if (team1 === team2)
      return sendError(res, "Cannot choose the same team", 400, "team2");

    if (!matchDate)
      return sendError(res, "Match Date cannot be blank", 400, "matchDate");
    if (!rate && rate !== 0)
      return sendError(res, "Rate cannot be blank", 400, "rate");
    if (rate < 0)
      return sendError(
        res,
        "Rate must be greater than or equal to 0",
        400,
        "rate"
      );
    if (rate > 3)
      return sendError(
        res,
        "Rate must be less than or equal to 3",
        400,
        "rate"
      );

    // Find team 1 and team 2 in database
    const matchExistingWithTeam1 = await Match.findOne({
      $or: [{ team1 }, { team2 }],
    });
    const matchExistingWithTeam2 = await Match.findOne({
      $or: [{ team2 }, { team1 }],
    });

    // Check if match date is exists
    if (
      moment(matchExistingWithTeam1?.matchDate).format(formatTime) ===
        moment(matchDate).format(formatTime) ||
      moment(matchExistingWithTeam2?.matchDate).format(formatTime) ===
        moment(matchDate).format(formatTime)
    )
      return sendError(
        res,
        "The match date of the match already exists for both teams",
        400,
        "team1"
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
    // Get user id from request
    const { userId } = req;

    // Get all bets by match id
    const bets = await Bet.find({ match: id });
    // Check if length of bet array is greater than 0
    if (bets.length > 0)
      return sendError(res, "Cannot delete this match right now");

    // Find match by id and delete
    const match = await Match.findByIdAndDelete(id);
    // Check if match not found
    if (!match) return sendError(res, "Match not found", 404);
    // Get user by user id
    const user = await User.findById(userId);
    if (!user) return sendError(res, "User not found", 404);

    // Get all matches after delete match
    const matches = await Match.find()
      .populate("team1 team2", "fullName flag name")
      .select("-__v");

    // Update user
    await User.findByIdAndUpdate(
      userId,
      {
        match: user.match.filter((match) => match.toString() !== id),
      },
      { new: true }
    );

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
    if (!match) return sendError(res, "Match not found", 404);

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
    if (!team1) return sendError(res, "Team 1 cannot be blank", 400, "team1");
    // Check if team 1 not exists
    const team1IsExisting = await Team.findById(team1);
    if (!team1IsExisting)
      return sendError(res, "Team 1 not found", 404, "team1");

    if (!team2) return sendError(res, "Team 2 cannot be blank", 400, "team2");
    // Check if team 2 not exists
    const team2IsExisting = await Team.findById(team2);
    if (!team2IsExisting)
      return sendError(res, "Team 2 not found", 404, "team2");

    if (!matchDate)
      return sendError(res, "Match Date cannot be blank", 400, "matchDate");
    if (!rate && rate !== 0)
      return sendError(res, "Rate cannot be blank", 400, "rate");
    if (rate < 0)
      return sendError(
        res,
        "Rate must be greater than or equal to 0",
        400,
        "rate"
      );
    if (rate > 3)
      return sendError(
        res,
        "Rate must be less than or equal to 3",
        400,
        "rate"
      );

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
    if (!resultOfTeam1 && resultOfTeam1 !== 0)
      return sendError(
        res,
        "Team 1 Score cannot be blank",
        400,
        "resultOfTeam1"
      );
    if (resultOfTeam1 < 0)
      return sendError(
        res,
        "Team 1 Score must be no less than 0",
        400,
        "resultOfTeam1"
      );
    if (!resultOfTeam2 && resultOfTeam2 !== 0)
      return sendError(
        res,
        "Team 2 Score cannot be blank",
        400,
        "resultOfTeam2"
      );
    if (resultOfTeam2 < 0)
      return sendError(
        res,
        "Team 2 Score must be no less than 0",
        400,
        "resultOfTeam1"
      );

    // Get match by id
    const match = await Match.findById(id)
      .populate("team1 team2", "fullName flag name")
      .select("-__v");
    if (!match) return sendError(res, "Match not found", 404, "match");
    if (match.isCanceled) return sendError(res, "The match has been canceled");

    // Get user id from request
    const user = await User.findById(userId).select("-__v -password");
    if (!user) return sendError(res, "User not found", 404, "user");

    // Get all bets by match id
    const bets = await Bet.find({ match: id })
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

    if (bets.length > 0) {
      // Update score check if user click auto generate result
      const updatedMatch = await Match.findByIdAndUpdate(
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

      await User.updateMany(
        { _id: { $in: bets.map((bet) => bet.user._id) } },
        {
          $inc: bets.map(
            async (bet) =>
              await User.findByIdAndUpdate(
                bet.user._id,
                {
                  money: updatedMatch.result
                    ? updatedMatch.result === bet.team.fullName
                      ? bet.money * 2 + bet.user.money
                      : updatedMatch.result === "Draw"
                      ? bet.money + bet.user.money
                      : bet.user.money
                    : bet.user.money,
                  winTimes: updatedMatch.result
                    ? updatedMatch.result === bet.team.fullName
                      ? bet.user.winTimes + 1
                      : bet.user.winTimes
                    : bet.user.winTimes,
                },
                { new: true }
              )
          ),
        }
      );

      // Get user by id after updated
      const updatedUser = await User.findById(userId).select("-__v -password");

      // Get all matches
      const matches = await Match.find()
        .populate("team1 team2", "fullName flag name")
        .select("-__v");
      if (!matches) return sendError(res, "Match not found", 404);

      // Get match after update score
      const getMatch = await Match.findById(id)
        .populate("team1 team2", "fullName flag name")
        .select("-__v");

      // Get team by match result
      const team1 = await Team.findOne({ fullName: getMatch.result });

      // Check if team 1 exist
      if (
        team1 &&
        matches
          .sort((a, b) => moment(a.matchDate) - moment(b.matchDate))
          .findIndex(
            (match) => match._id.toString() === getMatch._id.toString() && match
          ) %
          2 ===
          0
      ) {
        // Auto create a new match with 2 result
        await Match.create({
          team1: team1._id,
          rate: 0,
          matchDate: moment().add(2, "weeks"),
        });
      }

      // Send success notification
      return sendSuccess(res, "Update score successfully!", {
        user: updatedUser,
      });
    } else {
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

      // Get all matches
      const matches = await Match.find()
        .populate("team1 team2", "fullName flag name")
        .select("-__v");
      if (!matches) return sendError(res, "Match not found", 404);

      // Get match after update score
      const getMatch = await Match.findById(id)
        .populate("team1 team2", "fullName flag name")
        .select("-__v");

      // Get team by match result
      const team1 = await Team.findOne({ fullName: getMatch.result });

      // Check if team 1 exist
      if (
        team1 &&
        matches
          .sort((a, b) => moment(a.matchDate) - moment(b.matchDate))
          .findIndex(
            (match) => match._id.toString() === getMatch._id.toString() && match
          ) %
          2 ===
          0
      ) {
        // Auto create a new match with 2 result
        await Match.create({
          team1: team1._id,
          rate: 0,
          matchDate: moment().add(2, "weeks"),
        });
      }

      // Send success notification
      return sendSuccess(res, "Update score successfully!", { user });
    }
  } catch (error) {
    next(error);
  }
};
