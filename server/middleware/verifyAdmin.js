import sendError from "../helpers/sendError.js";
import User from "../models/user.js";

const verifyAdmin = async (req, res, next) => {
  try {
    // Get user id from request params
    const { userId } = req;

    // Get user by user id
    const user = await User.findById(userId).select("-__v -password");

    // Check if user role if is difference Admin
    if (user.roleID !== "Admin")
      return sendError(res, "You are not authorized to do this", 403);

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyAdmin;
