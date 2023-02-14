import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import Comment from "../models/comment.js";
import User from "../models/user.js";

export const createComment = async (req, res, next) => {
  try {
    // Get data from request body
    const { content } = req.body;
    // Get user id from request
    const { userId } = req;

    // Get user by id
    const user = await User.findById(userId);
    if (!user)
      return sendError(
        res,
        "Can not create comment right now, please login",
        404,
        "content"
      );

    // Check if content not found
    if (!content)
      return sendError(res, "Content can not be blank", 400, "content");

    // Create a new comment
    const newComment = await Comment.create({
      ...req.body,
      user: userId,
    });
    await newComment.save();

    // Get all comments
    const comments = await Comment.find()
      .populate("user", "-__v -password")
      .select("-__v");

    // Send success notification
    return sendSuccess(res, "Add new comment", {
      length: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  try {
    // Get all comments
    const comments = await Comment.find()
      .populate("user", "-__v -password")
      .select("-__v");
    // Check if comments not found
    if (!comments) return sendError(res, "No results found", 404);

    // Send success notification
    return sendSuccess(res, "Retrieving comments successfully", {
      length: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCommentById = async (req, res, next) => {
  try {
    // Get comment id from request params
    const { id } = req.params;
    // Get user if from request
    const { userId } = req;

    // Get user by user id
    const user = await User.findById(userId).select("-__v -password");
    if (!user) return sendError(res, "User not found", 404);

    // Get comment by comment id
    const getComment = await Comment.findById(id).populate(
      "user",
      "-__v -password"
    );
    // Check if comment not found
    if (!getComment) return sendError(res, "Comment not found", 404);

    if (user.roleID === "Admin") {
      // Find comment by id and delete it
      await Comment.findByIdAndDelete(id);
    } else if (user.roleID === "User") {
      if (user._id.toString() !== getComment.user._id.toString()) {
        return sendError(res, "You are not authorized to do this", 403);
      } else {
        // Find comment by id and delete it
        await Comment.findByIdAndDelete(id);
      }
    }

    // Get all comments after deleted
    const comments = await Comment.find()
      .populate("user", "-__v -password")
      .select("-__v");
    if (!comments) return sendError(res, "No results found", 404);

    // Send success notification
    return sendSuccess(res, "Delete comment successfully", {
      length: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCommentById = async (req, res, next) => {
  try {
    // Get data from request body
    const { content } = req.body;
    // Get comment id from request params
    const { id } = req.params;
    // Get user id from request
    const { userId } = req;

    // Get user by id
    const findUser = await User.findById(userId);
    // Get comment by id
    const findComment = await Comment.findById(id);
    // Check if user not equal
    if (
      findUser._id.toString() !== findComment.user.toString() &&
      findUser.roleID !== "Admin"
    )
      return sendError(res, "Can only update your comment", 400, "content");

    // Check if content not found
    if (!content)
      return sendError(res, "Content can not be blank", 400, "content");

    // Find and update comment
    const comment = await Comment.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    // Check if comment not found
    if (!comment) return sendError(res, "Comment not found", 404, "content");

    // Get all comment after updated
    const comments = await Comment.find()
      .populate("user", "-__v -password")
      .select("-__v");
    // Check if comments not found
    if (!comments) return sendError(res, "No results found", 404, "content");

    // Send success notification
    return sendSuccess(res, "Update comment successfully", {
      length: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};
