import { v2 as cloudinary } from "cloudinary";
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
        `Full name ${isExistingWithFullName.fullName} has already been taken.`
      );

    // Check if file exists
    if (file) {
      // Upload image to cloudinary
      await cloudinary.uploader
        .upload(file.path, {
          folder: "images",
          unique_filename: true,
          resource_type: "image",
          use_filename: true,
          overwrite: true,
        })
        .then(async (result) => {
          // Create new team
          const newTeam = await Team.create({
            ...req.body,
            flag: result.secure_url,
          });
          await newTeam.save();
        });
    } else {
      // Create new team
      const newTeam = await Team.create({ ...req.body });
      await newTeam.save();
    }

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
    next(error);
  }
};

export const updateTeam = async (req, res, next) => {
  try {
    // Get id from request
    const { id } = req.params;
    // Get data from request body
    const { name, fullName } = req.body;
    // Get file from request
    const { file } = req;

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
        `Full name ${isExistingWithFullName.fullName} has already been taken.`
      );

    // Check if file exists
    if (file) {
      // Upload image to cloudinary
      await cloudinary.uploader
        .upload(file.path, {
          folder: "images",
          unique_filename: true,
          resource_type: "image",
          use_filename: true,
          overwrite: true,
        })
        .then(async (result) => {
          // Update team
          await Team.findByIdAndUpdate(
            id,
            { ...req.body, flag: result.secure_url },
            { new: true }
          );
        });
    } else {
      // Update team
      await Team.findByIdAndUpdate(id, { ...req.body }, { new: true });
    }

    // Get all teams
    const teams = await Team.find().select("-__v");

    // Send success notification
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
