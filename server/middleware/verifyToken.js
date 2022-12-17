import jwt from "jsonwebtoken";
import sendError from "../helpers/sendError.js";

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken)
      return sendError(res, "You are not authenticated, please login", 401);

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

        req.userId = decoded.id;
        next();
      }
    );
  } catch (err) {
    next(err);
  }
};

export default verifyToken;
