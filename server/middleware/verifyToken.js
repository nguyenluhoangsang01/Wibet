import jwt from "jsonwebtoken";
import sendError from "../helpers/sendError.js";

const verifyToken = (req, res, next) => {
  try {
    // Check authorization from request headers
    const authHeader = req.headers.authorization;
    // Get access token from auth header
    const accessToken = authHeader?.split(" ")[1];

    // Check if access token is null
    if (!accessToken)
      return sendError(res, "You are not authenticated, please login", 401);

    // Use jwt to verify access token and set user if req
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      function (error, decoded) {
        if (error)
          return sendError(
            res,
            "Access token has expired or is otherwise invalid",
            498
          );

        req.userId = decoded.userId;
        req.accessToken = accessToken;
        next();
      }
    );
  } catch (err) {
    next(err);
  }
};

export default verifyToken;
