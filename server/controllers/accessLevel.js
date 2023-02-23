import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import AccessLevel from "../models/accessLevel.js";

export const createAccessLevel = async (req, res, next) => {
  try {
    // Get data from request body
    const { category, detail } = req.body;

    // Validate category not null
    if (!category)
      return sendError(res, "Category can not be blank", 400, "category");
    // Validate detail not null
    if (!detail)
      return sendError(res, "Detail can not be blank", 400, "detail");

    // Create a new access level
    const newAccessLevel = await AccessLevel.create({ ...req.body });
    await newAccessLevel.save();

    // Send success notification
    return sendSuccess(res, "Create access level successfully", null, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllAccessLevels = async (req, res, next) => {
  try {
    // Get all access level
    const accessLevels = await AccessLevel.find().select("-__v");
    if (!accessLevels) return sendError(res, "No access level found", 404);

    // Send success notification
    return sendSuccess(
      res,
      "Retrieving access level successfully",
      accessLevels
    );
  } catch (error) {
    next(error);
  }
};

export const getAccessLevel = async (req, res, next) => {
  try {
    // Get id from request params
    const { id } = req.params;

    // Get access level by id
    const accessLevel = await AccessLevel.findById(id).select("-__v");
    if (!accessLevel) return sendError(res, "Access level not found", 404);

    // Send success notification
    return sendSuccess(res, "Get access level successfully", accessLevel);
  } catch (error) {
    next(error);
  }
};

export const updateAccessLevel = async (req, res, next) => {
  try {
    // Get id from request params
    const { id } = req.params;
    // Get data from request body
    const { category, detail } = req.body;

    // Get access level by id
    const accessLevel = await AccessLevel.findById(id);
    if (!accessLevel) return sendError(res, "Access level not found", 404);

    // Validate category not null
    if (!category)
      return sendError(res, "Category can not be blank", 400, "category");
    // Validate detail not null
    if (!detail)
      return sendError(res, "Detail can not be blank", 400, "detail");

    // Find again with id and update
    await AccessLevel.findByIdAndUpdate(id, { ...req.body }, { new: true });

    // Send success notification
    return sendSuccess(res, "Update access level successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteAccessLevel = async (req, res, next) => {
  try {
    // Get id from request params
    const { id } = req.params;

    // Get access level by id
    const accessLevel = await AccessLevel.findById(id);
    if (!accessLevel) return sendError(res, "Access level not found", 404);

    // Find again and delete it
    await AccessLevel.findByIdAndDelete(id);

    // Send success notification
    return sendSuccess(res, "Delete access level successfully");
  } catch (error) {
    next(error);
  }
};
