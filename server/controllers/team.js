import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import Team from "../models/team.js";

export const createTeam = async (req, res, next) => {
  try {
    // Get data from request body
    const { name, fullName } = req.body;
    // Get file from request
    const { file } = req;

    // Validate
    if (!name) return sendError(res, "Name cannot be blank.");
    if (!fullName) return sendError(res, "Full name cannot be blank.");
    if (!file) return sendError(res, "No file was uploaded.", 404);

    const isExistingWithName = await Team.findOne({ name });
    if (isExistingWithName)
      return sendError(
        res,
        `Name ${isExistingWithName.name} has already been taken.`
      );
    const isExistingWithFullName = await Team.findOne({ fullName });
    if (isExistingWithFullName)
      return sendError(
        res,
        `Full name ${isExistingWithName.fullName} has already been taken.`
      );

    // Create new team
    const newTeam = await Team.create({ ...req.body });
    await newTeam.save();

    // Find all teams
    const teams = await Team.find().select("-__v");

    // Send success notification
    return sendSuccess(
      res,
      "Create team successfully!",
      {
        length: teams.length,
        teams,
      },
      201
    );
  } catch (error) {
    next(error.message);
  }
};

export const updateTeam = async (req, res, next) => {
  try {
    // Get id from request
    const { id } = req.params;
    // Get data from request body
    const { name, fullName } = req.body;

    const isExistingWithName = await Team.findOne({ name });
    if (isExistingWithName)
      return sendError(
        res,
        `Name ${isExistingWithName.name} has already been taken.`
      );
    const isExistingWithFullName = await Team.findOne({ fullName });
    if (isExistingWithFullName)
      return sendError(
        res,
        `Full name ${isExistingWithName.fullName} has already been taken.`
      );

    // Update team
    await Team.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    // Get all teams
    const teams = await Team.find().select("-__v");

    return sendSuccess(res, "Update team successfully!", {
      length: teams.length,
      teams,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req, res, next) => {
  try {
    // Get id from request params
    const { id } = req.params;

    // Check if team not exist and delete team
    const team = await Team.findByIdAndDelete(id);
    if (!team) return sendError(res, "Team not found", 404);

    // Get all teams after delete
    const teams = await Team.find().select("-__v");

    // Send success notification
    return sendSuccess(res, "Delete team successfully!", {
      length: teams.length,
      teams,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTeams = async (req, res, next) => {
  try {
    // Get all teams
    const teams = await Team.find().select("-__v");
    if (!teams) return sendError(res, "No results found", 404);

    // Send success notification
    return sendSuccess(res, "Retrieving teams successfully!", {
      length: teams.length,
      teams,
    });
  } catch (error) {
    next(error);
  }
};
