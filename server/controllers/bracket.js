export const createBracket = async (req, res, next) => {
  try {
    // Get data from request body
  } catch (error) {
    next(error);
  }
};

export const getAllBrackets = async (req, res, next) => {
  res.send("Get all brackets");
};

export const deleteBracketById = async (req, res, next) => {
  res.send("Delete bracket by id");
};

export const updateBracketById = async (req, res, next) => {
  res.send("Update bracket by id");
};
