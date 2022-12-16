import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import Team from "../models/team.js";

export const createTeam = async (req, res, next) => {
  try {
    // Get data from request body
    const { name, fullName, flag } = req.body;

    // Validate
    if (!name) return sendError(res, "Name cannot be blank.");
    if (!fullName) return sendError(res, "Full name cannot be blank.");
    if (!flag) return sendError(res, "Flag cannot be blank.");

    const isExistingWithName = await Team.findOne({ name });
    const isExistingWithFullName = await Team.findOne({ fullName });
    const isExistingWithFlag = await Team.findOne({ flag });
    if (isExistingWithName)
      return sendError(
        res,
        `Name ${isExistingWithName.name} has already been taken.`
      );
    if (isExistingWithFullName)
      return sendError(
        res,
        `Full name ${isExistingWithName.fullName} has already been taken.`
      );
    if (isExistingWithFlag)
      return sendError(
        res,
        `Flag ${isExistingWithName.flag} has already been taken.`
      );

    // Create new team
    const newTeam = await Team.create({ ...req.body });
    await newTeam.save();

    // Send success notification
    return sendSuccess(res, "Create team successfully!", null, 201);
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req, res, next) => {
  res.send("updateTeam");
};

export const deleteTeam = async (req, res, next) => {
  res.send("deleteTeam");
};

export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find().select("-__v");
    if (!teams) return sendError(res, "No results found");

    return sendSuccess(res, "Retrieving teams successfully!", teams);
  } catch (error) {
    next(error);
  }
};
