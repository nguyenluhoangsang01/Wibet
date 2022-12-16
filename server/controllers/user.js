import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import User from "../models/user.js";

export const createUser = async (req, res, next) => {
  try {
    // Get data from request body
    const { email, username, password } = req.body;

    // Validate
    if (!email) return sendError(res, "Email cannot be blank.");
    if (!validator.isEmail(email))
      return sendError(res, "Email is not a valid email address.");
    if (!username) return sendError(res, "Username cannot be blank.");
    if (!password) return sendError(res, "Password cannot be blank.");
    if (password.length < 3)
      return sendError(res, "Password should contain at least 3 characters.");

    const isExistingWithEmail = await User.findOne({ email });
    if (isExistingWithEmail)
      return sendError(
        res,
        `Email ${isExistingWithEmail.email} has already been taken.`
      );
    const isExistingWithUsername = await User.findOne({ username });
    if (isExistingWithUsername)
      return sendError(
        res,
        `Username ${isExistingWithUsername.username} has already been taken.`
      );

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    await newUser.save();

    // Send success notification
    return sendSuccess(res, "Create user successfully!", null, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    // Get data from request body
    const { email, username, password } = req.body;

    // Validate
    if (!email && !username)
      return sendError(res, "Email / Username cannot be blank.");
    if (!password) return sendError(res, "Password cannot be blank.");

    const isExistingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (!isExistingUser) return sendError(res, "Email / Username not found");

    // Compare password
    const comparedPassword = bcrypt.compareSync(
      password,
      isExistingUser.password
    );
    if (!comparedPassword) return sendError(res, "Incorrect password");

    // Set up access token
    const accessToken = jwt.sign(
      {
        id: isExistingUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Send HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    });

    // Get user logged
    const user = await User.findById(isExistingUser._id).select(
      "-__v -password"
    );

    // Send success notification
    return sendSuccess(res, "Logged successfully!", { accessToken, user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // Get user id from request
    const { userId } = req;
    const { email, username, newPassword } = req.body;

    // Validate
    if (!email) return sendError(res, "Email cannot be blank.");
    if (!validator.isEmail(email))
      return sendError(res, "Email is not a valid email address.");
    if (!username) return sendError(res, "Username cannot be blank.");

    const isExistingWithEmail = await User.findOne({ email });
    if (isExistingWithEmail)
      return sendError(
        res,
        `Email ${isExistingWithEmail.email} has already been taken.`
      );
    const isExistingWithUsername = await User.findOne({ username });
    if (isExistingWithUsername)
      return sendError(
        res,
        `Username ${isExistingWithUsername.username} has already been taken.`
      );

    // Check if user not exists
    const user = await User.findById(userId);
    if (!user) return sendError(res, "User not found", 404);

    // Check if password exist
    if (newPassword) {
      if (newPassword.length < 3)
        return sendError(res, "Password should contain at least 3 characters.");

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      // Update user with new password
      await User.findByIdAndUpdate(
        userId,
        {
          ...req.body,
          password: hashedPassword,
        },
        {
          new: true,
        }
      );
    }

    // Update user
    await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    const updatedUser = await User.findById(userId).select("-__v -password");

    return sendSuccess(res, "Update user successfully!", updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    // Get id from request params
    const { id } = req.params;
    const { email, username, newPassword } = req.body;

    // Validate
    if (!email) return sendError(res, "Email cannot be blank.");
    if (!validator.isEmail(email))
      return sendError(res, "Email is not a valid email address.");
    if (!username) return sendError(res, "Username cannot be blank.");

    const isExistingWithEmail = await User.findOne({ email });
    if (isExistingWithEmail)
      return sendError(
        res,
        `Email ${isExistingWithEmail.email} has already been taken.`
      );
    const isExistingWithUsername = await User.findOne({ username });
    if (isExistingWithUsername)
      return sendError(
        res,
        `Username ${isExistingWithUsername.username} has already been taken.`
      );

    // Check if user not exists
    const user = await User.findById(id);
    if (!user) return sendError(res, "User not found", 404);

    // Check if password exist
    if (newPassword) {
      if (newPassword.length < 3)
        return sendError(res, "Password should contain at least 3 characters.");

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      // Update user with new password
      await User.findByIdAndUpdate(
        id,
        {
          ...req.body,
          password: hashedPassword,
        },
        {
          new: true,
        }
      );
    }

    // Update user
    await User.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    const updatedUser = await User.findById(id).select("-__v -password");

    return sendSuccess(res, "Update user successfully!", updatedUser);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // Clear the cookie
    res.clearCookie("accessToken");

    // Send the response
    return sendSuccess(res, "User logged out successfully!");
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    // Get id from params
    const { id } = req.params;

    // Check if user not exists
    const user = await User.findById(id);
    if (!user) return sendError(res, "User not found", 404);

    // Delete user
    await User.findByIdAndDelete(id);

    // Get all users after delete
    const users = await User.find();

    // Send success notification
    return sendSuccess(res, "Delete user successfully!", users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    // Get id from params
    const { id } = req.params;

    // Check if user not exists
    const user = await User.findById(id).select("-__v -password");
    if (!user) return sendError(res, "User not found", 404);

    // Send success notification
    return sendSuccess(res, "Get user successfully!", user);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    // Get user id from request
    const { userId } = req;
    // Get data from request body
    const { currentPassword, newPassword } = req.body;

    // Validate
    if (!currentPassword)
      return sendError(res, "Current Password cannot be blank.");

    // Get user
    const user = await User.findById(userId);
    if (!user) return sendError(res, "User not found", 404);

    // Compare current password with old password
    const comparedCurrentPassword = bcrypt.compareSync(
      currentPassword,
      user.password
    );
    if (!comparedCurrentPassword)
      return sendError(res, "Current password incorrect");

    // Check if password is empty or not
    if (newPassword) {
      if (newPassword.length < 3)
        return sendError(res, "Password should contain at least 3 characters.");

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      // Update user with new password
      await User.findByIdAndUpdate(
        userId,
        {
          password: hashedPassword,
        },
        {
          new: true,
        }
      );
    }

    // Send success notification
    return sendSuccess(res, "Update password successfully!");
  } catch (error) {
    next(error);
  }
};
