const sendError = (res, message, statusCode = 400, name) =>
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    name,
  }); // Default statusCode is 400 Bad Request

export default sendError;
