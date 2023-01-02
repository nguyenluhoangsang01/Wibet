import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import Bet from "../models/bet.js";
import Match from "../models/match.js";
import Team from "../models/team.js";
import User from "../models/user.js";

export const createBetById = async (req, res, next) => {
  try {
    // Get match id from request params
    const { matchId } = req.params;
    // Get data from request body
    const { team, money } = req.body;
    // Get user id from request
    const { userId } = req;

    // Check if match not exists
    const match = await Match.findById(matchId)
      .populate("team1 team2", "fullName flag")
      .select("-__v");
    if (!match) return sendError(res, sendError("Match not found", 404));

    // Get user by id
    const user = await User.findById(userId);
    if (!user) return sendError(res, "User not found", 404);

    // Validate
    if (!team) return sendError(res, "Option cannot be blank.");
    if (!money) return sendError(res, "Money cannot be blank.");
    if (money < 50)
      return sendError(res, "Money must be greater than or equal to 50.");
    if (money > Number(user.money))
      return sendError(
        res,
        user.money < 50
          ? "The current money is not valid."
          : `Money must be less than or equal to ${user.money}.`
      );

    // Check if team not exists
    const isExistingTeam = await Team.findById(team);
    if (!isExistingTeam) return sendError(res, "Team not found", 404);

    // Check if team is difference between team 1 id and team 2
    if (
      team.toString() !== match.team1._id.toString() &&
      team.toString() !== match.team2._id.toString()
    )
      return sendError(res, "The selected team is not valid.");

    // Check if the match is over
    if (match.resultOfTeam1 || match.resultOfTeam2)
      return sendError(res, "The match is over");

    // Update current money of user
    await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        money: Number(user.money) - money,
        betTimes: user.betTimes + 1,
      },
      { new: true }
    );

    // Update status
    await Match.findByIdAndUpdate(
      matchId,
      {
        ...req.body,
        statusOfTeam1:
          match.team1._id.toString() === team.toString()
            ? match.statusOfTeam1 + money
            : match.statusOfTeam1,
        statusOfTeam2:
          match.team2._id.toString() === team.toString()
            ? match.statusOfTeam2 + money
            : match.statusOfTeam2,
      },
      { new: true }
    );

    // Create a new bet
    const newBet = await Bet.create({
      ...req.body,
      user: userId,
      match: matchId,
      betTime: moment().format("HH:mm:ss - yyyy/MM/DD"),
    });
    await newBet.save();

    // Get all bet
    const bet = await Bet.findById(newBet._id)
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
    if (!bet) return sendError(res, "No results found", 404);

    // Send success notification
    return sendSuccess(res, "Create bet successfully!", bet, 201);
  } catch (error) {
    next(error);
  }
};

export const deleteBetById = async (req, res, next) => {
  try {
    // Get bet id from request params
    const { betId, matchId } = req.params;
    // Get user id from request
    const { userId } = req;

    // Find bet by id and delete it
    const bet = await Bet.findByIdAndDelete(betId);
    // Check if bet not exists
    if (!bet) return sendError(res, "Bet not found", 404);

    // Check if match not exists
    const match = await Match.findById(matchId)
      .populate("team1 team2", "fullName flag")
      .select("-__v");
    if (!match) return sendError(res, sendError("Match not found", 404));

    // Get user by id
    const user = await User.findById(userId);
    if (!user) return sendError(res, "User not found", 404);

    // Update user
    await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        money:
          match.statusOfTeam1 !== 0
            ? user.money + match.statusOfTeam1
            : match.statusOfTeam2 !== 0 && user.money + match.statusOfTeam2,
        betTimes: user.betTimes - 1,
      },
      { new: true }
    );

    // Update status
    await Match.findByIdAndUpdate(
      matchId,
      {
        ...req.body,
        statusOfTeam1: 0,
        statusOfTeam2: 0,
      },
      { new: true }
    );

    // Get user after handle logic
    const userAfterDelete = await User.findById(userId).select(
      "-__v -password"
    );

    // Send success notification
    return sendSuccess(res, "Delete bet successfully!", userAfterDelete);
  } catch (error) {
    next(error);
  }
};

export const getBetByBetId = async (req, res, next) => {
  try {
    // Get bet id from request params
    const { betId } = req.params;

    // Find bet by bet id
    const bet = await Bet.findById(betId)
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
    // Check if bet not exists
    if (!bet) return sendError(res, "Bet not found", 404);

    // Send success notification
    return sendSuccess(res, "Get bet successfully!", bet);
  } catch (error) {
    next(error);
  }
};

export const getBetByMatchId = async (req, res, next) => {
  try {
    // Get match id from request params
    const { matchId } = req.params;

    // Find bet by match id
    const bet = await Bet.findOne({ match: matchId })
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
    if (!bet) return sendError(res, "Bet not found", 404);

    // Send success notification
    return sendSuccess(res, "Get bet successfully!", bet);
  } catch (error) {
    next(error);
  }
};

export const updateBetById = async (req, res, next) => {
  try {
    // Get bet id and match id from request params
    const { betId, matchId } = req.params;
    // Get data from request body
    const { team, money } = req.body;
    // Get user id from request
    const { userId } = req;

    // Check if match not exists
    const match = await Match.findById(matchId)
      .populate("team1 team2", "fullName flag")
      .select("-__v");
    if (!match) return sendError(res, sendError("Match not found", 404));

    // Get user by id
    const user = await User.findById(userId);
    if (!user) return sendError(res, "User not found", 404);

    // Validate
    if (!team) return sendError(res, "Team cannot be blank.");
    if (!money) return sendError(res, "Money cannot be blank.");
    if (money < 50)
      return sendError(res, "Money must be greater than or equal to 50.");

    // Check if team not exists
    const isExistingTeam = await Team.findById(team);
    if (!isExistingTeam) return sendError(res, "Team not found", 404);

    // Check if team is difference between team 1 id and team 2
    if (
      team.toString() !== match.team1._id.toString() &&
      team.toString() !== match.team2._id.toString()
    )
      return sendError(res, "The selected team is not valid.");

    // Find bet
    const getBet = await Bet.findById(betId)
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

    // Check if money bet greater than current money and money betted
    if (money > Number(getBet.money) + Number(getBet.user.money))
      return sendError(
        res,
        `Money must be less than or equal to ${
          Number(getBet.money) + Number(getBet.user.money)
        }.`
      );

    // Update current money of user
    await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        money: Number(getBet.money) + Number(getBet.user.money) - money,
      },
      { new: true }
    );

    // Find bet by id and update it
    const bet = await Bet.findByIdAndUpdate(
      betId,
      { ...req.body },
      { new: true }
    )
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

    // Send success notification
    return sendSuccess(res, "Update bet successfully!", bet);
  } catch (error) {
    next(error);
  }
};

export const getAllBets = async (req, res, next) => {
  try {
    // Get all bets
    const bets = await Bet.find()
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
    // Check if bets not found
    if (!bets) return sendError(res, "No results found.");

    // Send success notification
    return sendSuccess(res, "Retrieving bets successfully!", {
      length: bets.length,
      bets,
    });
  } catch (error) {
    next(error);
  }
};

// export const withdrawMoney = async (req, res, next) => {
//   try {
//     // Get user id from request
//     const { userId } = req;
//     // Get bet id from request params
//     const { betId } = req.params;

//     // Get bet by id and get user by id. Check if user logged not equal
//     // Check if bet and user not found
//     const findBet = await Bet.findById(betId)
//       .populate("team user", "-__v -password")
//       .select("-__v")
//       .populate({
//         path: "match",
//         populate: {
//           path: "team1 team2",
//           select: "name fullName flag",
//         },
//         select: "-__v",
//       });
//     if (!findBet) return sendError(res, "Bet not found", 404);

//     const findUser = await User.findById(userId).select("-__v -password");
//     if (!findUser) return sendError(res, "User not found", 404);

//     if (findBet.user.email.toString() !== findUser.email.toString())
//       return sendError(res, "Can only withdraw your own money.");
//     // ********

//     // Get match id from bet selected and set isCanceled to true
//     await Match.findByIdAndUpdate(
//       findBet.match._id,
//       {
//         ...req.body,
//         isCanceled: true,
//       },
//       { new: true }
//     );

//     // After check
//     // Get bet by id and delete it
//     const bet = await Bet.findByIdAndDelete(betId)
//       .populate("team user", "-__v -password")
//       .select("-__v")
//       .populate({
//         path: "match",
//         populate: {
//           path: "team1 team2",
//           select: "name fullName flag",
//         },
//         select: "-__v",
//       });

//     // Get user by id and withdraw money betted
//     const user = await User.findByIdAndUpdate(
//       userId,
//       {
//         ...req.body,
//         money: Number(bet.money) + Number(bet.user.money),
//       },
//       { new: true }
//     ).select("-__v -password");

//     // Send success notification
//     return sendSuccess(res, "Withdraw and delete bet successfully!", user);
//   } catch (error) {
//     next(error);
//   }
// };

export const withdrawMoney = async (req, res, next) => {
  try {
    // Get match id from request params
    // const { matchId } = req.params;
    // Get user id from request
    // const { userId } = req;

    // Get match by id
    // const match = await Match.findById(matchId)
    //   .populate("team1 team2", "fullName flag name")
    //   .select("-__v");
    // if (!match) return sendError(res, "Match not found", 404);
    // if (match.result)
    //   return sendError(res, "The match is over, cannot withdraw");

    // Get user by id
    // const user = await User.findById(userId).select("-__v -password");
    // if (!user) return sendError(res, "User not found", 404);

    // Update match to canceled when user withdraw all money from all bets
    // await Match.findByIdAndUpdate(
    //   matchId,
    //   {
    //     isCanceled: true,
    //     statusOfTeam1: 0,
    //     statusOfTeam2: 0,
    //   },
    //   { new: true }
    // );

    // Find all bet have same match id

    // // Update user
    // await User.findByIdAndUpdate(userId, {
    // 	money: match.isCanceled ? user.money + bet
    // }, {new:true});

    // Send success notification
    return sendSuccess(res, "Withdraw successfully!");
  } catch (error) {
    next(error);
  }
};
