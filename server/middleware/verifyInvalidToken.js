import sendError from "../helpers/sendError.js";
import User from "../models/user.js";

const verifyInvalidToken = async (req, res, next) => {
  try {
    // Get user id and access token from request
    const { userId, accessToken } = req;

    // Get user by user id
    const user = await User.findById(userId);

    // Check if accessToken from user is null
    if (!user.accessToken)
      return sendError(res, "You are not authenticated, please login", 401);

    // Check if access token is difference with access token from user
    if (accessToken.toString() !== user.accessToken.toString())
      return sendError(
        res,
        "Access token has expired or is otherwise invalid",
        498
      );

    // If check is ok will next
    next();
  } catch (error) {
    next(error);
  }
};

export default verifyInvalidToken;
