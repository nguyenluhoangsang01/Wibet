import bcrypt from "bcrypt";
import IP from "ip";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import validator from "validator";
import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import User from "../models/user.js";

export const createUser = async (req, res, next) => {
  try {
    // Get data from request body
    const { email, username, password } = req.body;
    // Get user id from request
    const { userId } = req;

    // Get current ip address
    const currentIpAddress = IP.address();

    // Get user by id
    const user = await User.findById(userId);
    if (!user) return sendError(res, "User not found", 404);

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
      createdBy: user.username,
      createdIp: currentIpAddress,
    });
    await newUser.save();

    const getNewCreatedNewUser = await User.findById(newUser._id).select(
      "-__v -password"
    );

    // Send success notification
    return sendSuccess(
      res,
      "Create user successfully!",
      { user: getNewCreatedNewUser },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    // Get data from request body
    const { email, username, password } = req.body;

    // Get current ip address
    const currentIpAddress = IP.address();

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
        userId: isExistingUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Get user logged
    const user = await User.findByIdAndUpdate(isExistingUser._id, {
      loggedInAt: moment().format("HH:mm:ss - yyyy/MM/DD"),
      loggedInIp: currentIpAddress,
    }).select("-__v -password");
    // Check if user is banned
    if (user.banned) return sendError(res, "User is banned");
    if (user.status === "Inactive")
      return sendError(
        res,
        "The account is inactive, please contact the Wibet Admin"
      );

    // Send success notification
    return sendSuccess(res, "Logged successfully!", {
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // Get user id from request
    const { userId } = req;
    // Get data from request body
    const { email, username, newPassword } = req.body;

    // Validate
    if (!email) return sendError(res, "Email cannot be blank.");
    if (!validator.isEmail(email))
      return sendError(res, "Email is not a valid email address.");
    if (!username) return sendError(res, "Username cannot be blank.");

    // Check if user not exists
    const user = await User.findById(userId);
    if (!user) return sendError(res, "User not found", 404);

    const isExistingWithEmail = await User.findOne({
      email: { $ne: user.email, $eq: email },
    });
    if (isExistingWithEmail)
      return sendError(
        res,
        `Email ${isExistingWithEmail.email} has already been taken.`
      );
    const isExistingWithUsername = await User.findOne({
      username: { $ne: user.username, $eq: username },
    });
    if (isExistingWithUsername)
      return sendError(
        res,
        `Username ${isExistingWithUsername.username} has already been taken.`
      );

    // Check if password exist
    if (newPassword) {
      if (newPassword.length < 3)
        return sendError(res, "Password should contain at least 3 characters.");

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

      // Update user with new password
      await User.findByIdAndUpdate(
        userId,
        { ...req.body, password: hashedNewPassword },
        { new: true }
      );
    }

    // Update user
    await User.findByIdAndUpdate(userId, { ...req.body }, { new: true });

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
    const { email, username, newPassword, banned } = req.body;

    // Validate
    if (!email) return sendError(res, "Email cannot be blank.");
    if (!validator.isEmail(email))
      return sendError(res, "Email is not a valid email address.");
    if (!username) return sendError(res, "Username cannot be blank.");

    // Check if user not exists
    const user = await User.findById(id);
    if (!user) return sendError(res, "User not found", 404);

    const isExistingWithEmail = await User.findOne({
      email: { $ne: user.email, $eq: email },
    });
    if (isExistingWithEmail)
      return sendError(
        res,
        `Email ${isExistingWithEmail.email} has already been taken.`
      );
    const isExistingWithUsername = await User.findOne({
      username: { $ne: user.username, $eq: username },
    });
    if (isExistingWithUsername)
      return sendError(
        res,
        `Username ${isExistingWithUsername.username} has already been taken.`
      );

    // Check if password exist
    if (newPassword) {
      if (newPassword.length < 3)
        return sendError(res, "Password should contain at least 3 characters.");

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

      // Update user with new password
      await User.findByIdAndUpdate(
        id,
        {
          ...req.body,
          password: hashedNewPassword,
          bannedAt: banned && moment().format("HH:mm:ss - yyyy/MM/DD"),
        },
        { new: true }
      );
    }

    // Update user
    await User.findByIdAndUpdate(
      id,
      {
        ...req.body,
        bannedAt: banned && moment().format("HH:mm:ss - yyyy/MM/DD"),
      },
      { new: true }
    );

    return sendSuccess(res, "Update user successfully!");
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

    // Check if user not exist and delete user
    const user = await User.findByIdAndDelete(id);
    if (!user) return sendError(res, "User not found", 404);

    // Get all users after delete
    const users = await User.find().select("-__v -password");

    // Send success notification
    return sendSuccess(res, "Delete user successfully!", {
      length: users.length,
      users,
    });
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
    let updatedUser = null;

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
      return sendError(res, "Current password is incorrect");

    // Compare new password with old password if new password is not empty
    let comparedNewPassword;
    if (newPassword) {
      comparedNewPassword = bcrypt.compareSync(newPassword, user.password);
    } else {
      // Send success notification
      return sendSuccess(res, "Password has not been changed.", { user });
    }

    // Check if password is empty or not
    if (newPassword && !comparedNewPassword) {
      if (newPassword.length < 3)
        return sendError(res, "Password should contain at least 3 characters.");

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

      // Update user with new password
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          password: hashedNewPassword,
        },
        { new: true }
      ).select("-__v -password");

      // Send success notification
      return sendSuccess(res, "Update password successfully!", {
        user: updatedUser,
      });
    } else {
      // Send success notification
      return sendSuccess(res, "Password has not been changed.", { user });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    // Get all users
    const users = await User.find().select("-__v -password");
    if (!users) return sendError(res, "No results found", 404);

    // Send success notification
    return sendSuccess(res, "Retrieving users successfully!", {
      length: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    // Get user if from request
    const { userId } = req;
    // Get data from request body
    const { fullName, timezone } = req.body;

    // Validate
    if (!fullName) return sendError(res, "Full Name cannot be blank.");
    if (!timezone) return sendError(res, "Timezone cannot be blank.");

    // Get user logged
    const user = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { new: true }
    ).select("-__v -password");
    // Check if user not exists
    if (!user) return sendError(res, "User not found", 404);

    // Send success notification
    return sendSuccess(res, "Update profile successfully!", { user });
  } catch (error) {
    next(error);
  }
};
