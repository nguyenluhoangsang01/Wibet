import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import Ranking from "../models/ranking.js";

export const getAllRanking = async (req, res, next) => {
  try {
    // Get all ranking
    const ranking = await Ranking.find()
      .populate("user bet", "-__v -password")
      .select("-__v");
    // Check if ranking not found
    if (!ranking) return sendError(res, "No results found", 404);

    // Send success notification
    return sendSuccess(res, "Retrieving ranking successfully!", {
      length: ranking.length,
      ranking,
    });
  } catch (error) {
    next(error);
  }
};

export const getRankingById = async (req, res, next) => {
  try {
    // Get ranking id from request params
    const { id } = req.params;
    // Get ranking by id
    const ranking = await Ranking.findById(id)
      .populate("user bet", "-__v -password")
      .select("-__v");
    // Check if ranking not found
    if (!ranking) return sendError(res, "Ranking not found", 404);

    // Send success notification
    return sendSuccess(res, "Get ranking successfully!", ranking);
  } catch (error) {
    next(error);
  }
};
