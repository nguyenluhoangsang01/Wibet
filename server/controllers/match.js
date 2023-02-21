import moment from "moment";
import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import Bet from "../models/bet.js";
import Match from "../models/match.js";
import Setting from "../models/setting.js";
import Team from "../models/team.js";
import User from "../models/user.js";

export const createMatch = async (req, res, next) => {
  try {
    // Get data from request body
    const { team1, team2, matchDate, rate } = req.body;

    const settings = await Setting.find().select("-__v");
    if (!settings) return sendError(res, "No settings found", 400);
    const lastSetting = settings[settings.length - 1];

    // Validate
    if (!team1) return sendError(res, "Team 1 can not be blank", 400, "team1");
    // Check if team 1 not exists
    const team1IsExisting = await Team.findById(team1);
    if (!team1IsExisting)
      return sendError(res, "Team 1 not found", 404, "team1");
    // Check if team 2 not exists
    if (!team2) return sendError(res, "Team 2 can not be blank", 400, "team2");
    const team2IsExisting = await Team.findById(team2);
    if (!team2IsExisting)
      return sendError(res, "Team 2 not found", 404, "team2");

    // Check if team 1 equal team 2
    if (team1 === team2)
      return sendError(res, "Can not choose the same team", 400, "team2");

    if (!matchDate)
      return sendError(res, "Match Date can not be blank", 400, "matchDate");
    if (!rate && rate !== 0)
      return sendError(res, "Rate can not be blank", 400, "rate");
    if (rate < lastSetting.minRate)
      return sendError(
        res,
        `Rate must be greater than or equal to ${lastSetting.minRate}`,
        400,
        "rate"
      );
    if (rate > lastSetting.maxRate)
      return sendError(
        res,
        `Rate must be less than or equal to ${lastSetting.maxRate}`,
        400,
        "rate"
      );

    // Find team 1 and team 2 in database
    const matchExistingWithTeam = await Match.findOne({
      $or: [{ team1 }, { team2 }],
    });
    if (matchExistingWithTeam)
      return sendError(
        res,
        "Can not choose team 1 or team 2 right now",
        400,
        "team"
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
      "Create match successfully",
      { length: matches.length, matches },
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
      return sendError(res, "Can not delete this match right now");

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
      { match: user.match.filter((match) => match.toString() !== id) },
      { new: true }
    );

    // Send success notification
    return sendSuccess(res, "Delete match successfully", {
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
    return sendSuccess(res, "Retrieving matches successfully", {
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
    return sendSuccess(res, "Get match successfully", match);
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

    const settings = await Setting.find().select("-__v");
    if (!settings) return sendError(res, "No settings found", 400);
    const lastSetting = settings[settings.length - 1];

    // Validate
    if (!team1) return sendError(res, "Team 1 can not be blank", 400, "team1");
    // Check if team 1 not exists
    const team1IsExisting = await Team.findById(team1);
    if (!team1IsExisting)
      return sendError(res, "Team 1 not found", 404, "team1");

    if (!team2) return sendError(res, "Team 2 can not be blank", 400, "team2");
    // Check if team 2 not exists
    const team2IsExisting = await Team.findById(team2);
    if (!team2IsExisting)
      return sendError(res, "Team 2 not found", 404, "team2");

    if (!matchDate)
      return sendError(res, "Match Date can not be blank", 400, "matchDate");
    if (!rate && rate !== 0)
      return sendError(res, "Rate can not be blank", 400, "rate");
    if (rate < lastSetting.minRate)
      return sendError(
        res,
        `Rate must be greater than or equal to ${lastSetting.minRate}`,
        400,
        "rate"
      );
    if (rate > lastSetting.maxRate)
      return sendError(
        res,
        `Rate must be less than or equal to ${lastSetting.maxRate}`,
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
    return sendSuccess(res, "Update match successfully", {
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

    const settings = await Setting.find().select("-__v");
    if (!settings) return sendError(res, "No settings found", 400);
    const lastSetting = settings[settings.length - 1];

    // Time update score setting
    const timeUpdateScoreSetting = lastSetting.timeUpdateScore;

    // Validate
    if (!resultOfTeam1 && resultOfTeam1 !== 0)
      return sendError(
        res,
        "Team 1 Score can not be blank",
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
    if (resultOfTeam1 > lastSetting.maxScore)
      return sendError(
        res,
        `Team 1 Score must be greater than or equal to ${lastSetting.maxScore}`,
        400,
        "resultOfTeam1"
      );
    if (!Number.isInteger(resultOfTeam1))
      return sendError(
        res,
        "Team 1 Score must be an integer",
        400,
        "resultOfTeam1"
      );
    if (!resultOfTeam2 && resultOfTeam2 !== 0)
      return sendError(
        res,
        "Team 2 Score can not be blank",
        400,
        "resultOfTeam2"
      );
    if (resultOfTeam2 < 0)
      return sendError(
        res,
        "Team 2 Score must be no less than 0",
        400,
        "resultOfTeam2"
      );
    if (resultOfTeam2 > lastSetting.maxScore)
      return sendError(
        res,
        `Team 2 Score must be greater than or equal to ${lastSetting.maxScore}`,
        400,
        "resultOfTeam2"
      );
    if (!Number.isInteger(resultOfTeam2))
      return sendError(
        res,
        "Team 2 Score must be an integer",
        400,
        "resultOfTeam2"
      );

    // Get match by id
    const match = await Match.findById(id)
      .populate("team1 team2", "fullName flag name")
      .select("-__v");
    if (!match) return sendError(res, "Match not found", 404, "match");
    if (match.isCanceled) return sendError(res, "The match has been canceled");

    // Ninety minutes after
    const ninetyMinutesLater = moment(match.matchDate).add(
      timeUpdateScoreSetting,
      "minutes"
    );

    // Check if current time before match date about times
    if (moment().isBefore(ninetyMinutesLater))
      return sendError(
        res,
        `Results can only be updated ${timeUpdateScoreSetting} minutes after the match has started`,
        400,
        "resultOfTeam1"
      );

    // Check if result of team 1 equal with result of team 2
    if (resultOfTeam1 === resultOfTeam2)
      return sendError(
        res,
        "The result of the match can not be drawn",
        400,
        "resultOfTeam1"
      );

    // Get user id from request
    const user = await User.findById(userId).select("-__v -password");
    if (!user) return sendError(res, "User not found", 404, "user");

    // Get all matches
    const getAllMatches = await Match.find()
      .populate("team1 team2", "fullName flag name")
      .select("-__v");
    if (!getAllMatches) return sendError(res, "Match not found", 404);

    // Get match after update score
    const currentMatch = await Match.findById(id)
      .populate("team1 team2", "fullName flag name")
      .select("-__v");

    // Get match 2 after update score
    const previousMatch =
      getAllMatches[
        getAllMatches
          .sort((a, b) => moment(a.matchDate) - moment(b.matchDate))
          .findIndex(
            (match) => match.matchDate > currentMatch.matchDate && match
          ) - 2
      ] ||
      getAllMatches[
        getAllMatches
          .sort((a, b) => moment(b.matchDate) - moment(a.matchDate))
          .findIndex(
            (match) => match.matchDate < currentMatch.matchDate && match
          )
      ];

    // Check if previous match is exist and it not have result
    if (previousMatch) {
      if (!previousMatch.result)
        return sendError(
          res,
          "Can not update score of this match right now",
          400,
          "resultOfTeam1"
        );
    }

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

    // Get all matches
    const matches = await Match.find()
      .populate("team1 team2", "fullName flag name")
      .select("-__v");
    if (!matches) return sendError(res, "Match not found", 404);

    // Get match after update score
    const getMatch = await Match.findById(id)
      .populate("team1 team2", "fullName flag name")
      .select("-__v");

    // Get team 1 by match result
    const team1 = await Team.findOne({
      fullName:
        getMatch.resultOfTeam1 < getMatch.resultOfTeam2
          ? getMatch.team2.fullName
          : getMatch.team1.fullName,
    });

    // Get match 2 after update score
    const getMatch2 =
      matches[
        matches
          .sort((a, b) => moment(a.matchDate) - moment(b.matchDate))
          .findIndex((match) => match.matchDate > getMatch.matchDate && match) -
          2
      ] ||
      matches[
        matches
          .sort((a, b) => moment(a.matchDate) - moment(b.matchDate))
          .findIndex((match) => match)
      ];

    // Get team 2 by match result
    const team2 = await Team.findOne({
      fullName:
        getMatch2.resultOfTeam1 < getMatch2.resultOfTeam2
          ? getMatch2.team2.fullName
          : getMatch2.team1.fullName,
    });

    if (bets.length > 0) {
      // Update user
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

      // Check if team 1 exist
      if (
        team1 &&
        matches
          .sort((a, b) => moment(a.matchDate) - moment(b.matchDate))
          .findIndex(
            (match) => match._id.toString() === getMatch._id.toString() && match
          ) %
          2 !==
          0
      ) {
        if (team1 && team2) {
          // Auto create a new match with 2 result
          await Match.create({
            team1: team1._id,
            team2: team2._id,
            rate: lastSetting.minRate,
            matchDate: moment(getMatch.matchDate).add(2, "weeks"),
          });
        }
      }

      // Send success notification
      return sendSuccess(res, "Update score successfully", {
        user: updatedUser,
      });
    } else {
      // Check if team 1 exist
      if (
        team1 &&
        matches
          .sort((a, b) => moment(a.matchDate) - moment(b.matchDate))
          .findIndex(
            (match) => match._id.toString() === getMatch._id.toString() && match
          ) %
          2 !==
          0
      ) {
        if (team1 && team2) {
          // Auto create a new match with 2 result
          await Match.create({
            team1: team1._id,
            team2: team2._id,
            rate: lastSetting.minRate,
            matchDate: moment(getMatch.matchDate).add(2, "weeks"),
          });
        }
      }

      // Send success notification
      return sendSuccess(res, "Update score successfully", { user });
    }
  } catch (error) {
    next(error);
  }
};
