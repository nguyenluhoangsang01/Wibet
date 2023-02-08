import bcrypt from "bcrypt";
import IP from "ip";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import { formatTime, STATUS } from "../constants.js";
import { isValidEmail } from "../helpers/isValidEmail.js";
import sendError from "../helpers/sendError.js";
import sendSuccess from "../helpers/sendSuccess.js";
import User from "../models/user.js";

export const createUser = async (req, res, next) => {
  try {
    // Get data from request body
    const { email, username, password, money } = req.body;
    // Get user id from request
    const { userId } = req;

    // Get current ip address
    const currentIpAddress = IP.address();

    // Get user by id
    const user = await User.findById(userId);
    if (!user) return sendError(res, "User not found", 404);

    // Validate
    if (!email) return sendError(res, "Email cannot be blank", 400, "email");
    if (!isValidEmail(email))
      return sendError(res, "Email is not a valid email address", 400, "email");
    if (!username)
      return sendError(res, "Username cannot be blank", 400, "username");
    if (!password)
      return sendError(res, "Password cannot be blank", 400, "password");
    if (password.length < 3)
      return sendError(
        res,
        "Password should contain at least 3 characters",
        400,
        "password"
      );
    if (money && !Number.isInteger(money))
      return sendError(res, "Money must be an integer", 400, "money");
    if (money && money < 200)
      return sendError(
        res,
        "Money must be greater than or equal to 200",
        400,
        "money"
      );

    const isExistingWithEmail = await User.findOne({ email });
    if (isExistingWithEmail)
      return sendError(
        res,
        `Email ${isExistingWithEmail.email} has already been taken.`,
        400,
        "email"
      );
    const isExistingWithUsername = await User.findOne({ username });
    if (isExistingWithUsername)
      return sendError(
        res,
        `Username ${isExistingWithUsername.username} has already been taken.`,
        400,
        "username"
      );

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      createdBy: user.username,
      createdIp: currentIpAddress,
      money: money < 200 ? 200 : money,
    });
    await newUser.save();

    const getNewCreatedNewUser = await User.findById(newUser._id).select(
      "-__v -password"
    );

    // Send success notification
    return sendSuccess(
      res,
      "Create user successfully",
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
      return sendError(
        res,
        "Email / Username cannot be blank",
        400,
        "emailOrUsername"
      );
    if (!password)
      return sendError(res, "Password cannot be blank", 400, "password");

    // Get user selected to check if it not exist
    const isExistingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    // Check if user not found
    if (!isExistingUser)
      return sendError(
        res,
        "Email / Username not found",
        400,
        "emailOrUsername"
      );
    // Check if user is inactive
    if (isExistingUser.status === "Inactive")
      return sendError(res, "The account is inactive", 400, "emailOrUsername");
    // Check if user is banned
    if (isExistingUser.banned)
      return sendError(res, "User is banned", 400, "emailOrUsername");

    // Compare password
    const comparedPassword = bcrypt.compareSync(
      password,
      isExistingUser.password
    );

    // Check if incorrect password
    if (!comparedPassword) {
      // +1 times wrong password
      const updatedWrongPasswordTimes = await User.findOneAndUpdate(
        { $or: [{ email }, { username }] },
        { wrongPassword: isExistingUser.wrongPassword + 1 },
        { new: true }
      );

      // Check if wrong password times greater than 5
      if (
        updatedWrongPasswordTimes.wrongPassword >= 5 &&
        updatedWrongPasswordTimes.status !== "Inactive"
      ) {
        await User.findOneAndUpdate(
          { $or: [{ email }, { username }] },
          { status: Object.keys(STATUS)[0], wrongPassword: 0 },
          { new: true }
        );
      }

      // Send error notification
      return sendError(
        res,
        `You have entered incorrect login information ${updatedWrongPasswordTimes.wrongPassword} times consecutively. Please note that Wibet service will be TEMPORARY INACTIVE if you enter the wrong password 5 times. You can reset the password by contact with Wibet Admin.`,
        400,
        "password"
      );
    }

    // if logging successfully set wrong password is default
    await User.findOneAndUpdate(
      { $or: [{ email }, { username }] },
      { wrongPassword: 0 },
      { new: true }
    );

    // Set up access token
    const accessToken = jwt.sign(
      { userId: isExistingUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    // Send HTTP-only cookie
    res.cookie("accessToken", accessToken);

    // Get user logged
    const user = await User.findByIdAndUpdate(isExistingUser._id, {
      loggedInAt: moment().format(formatTime),
      loggedInIp: currentIpAddress,
    }).select("-__v -password");

    // Send success notification
    return sendSuccess(res, "Logged successfully", {
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
    if (!email) return sendError(res, "Email cannot be blank", 400, "email");
    if (!isValidEmail(email))
      return sendError(res, "Email is not a valid email address", 400, "email");
    if (!username)
      return sendError(res, "Username cannot be blank", 400, "username");

    // Check if user not exists
    const user = await User.findById(userId);
    if (!user) return sendError(res, "User not found", 404, "user");

    const isExistingWithEmail = await User.findOne({
      email: { $ne: user.email, $eq: email },
    });
    if (isExistingWithEmail)
      return sendError(
        res,
        `Email ${isExistingWithEmail.email} has already been taken.`,
        400,
        "email"
      );
    const isExistingWithUsername = await User.findOne({
      username: { $ne: user.username, $eq: username },
    });
    if (isExistingWithUsername)
      return sendError(
        res,
        `Username ${isExistingWithUsername.username} has already been taken.`,
        400,
        "username"
      );

    // Check if password exist
    if (newPassword) {
      if (newPassword.length < 3)
        return sendError(
          res,
          "Password should contain at least 3 characters",
          400,
          "newPassword"
        );

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

      // Update user with new password
      await User.findByIdAndUpdate(
        userId,
        {
          ...req.body,
          password: hashedNewPassword,
        },
        { new: true }
      );
    }

    // Update user
    await User.findByIdAndUpdate(userId, { ...req.body }, { new: true });

    const updatedUser = await User.findById(userId).select("-__v -password");

    return sendSuccess(res, "Update user successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    // Get id from request params
    const { id } = req.params;
    const { email, username, newPassword, banned } = req.body;

    // Check if user not exists
    const user = await User.findById(id);
    if (!user) return sendError(res, "User not found", 404);

    // Validate
    if (!email) return sendError(res, "Email cannot be blank", 400, "email");
    if (!isValidEmail(email))
      return sendError(res, "Email is not a valid email address", 400, "email");
    const isExistingWithEmail = await User.findOne({
      email: { $ne: user.email, $eq: email },
    });
    if (isExistingWithEmail)
      return sendError(
        res,
        `Email ${isExistingWithEmail.email} has already been taken.`,
        400,
        "email"
      );

    if (!username)
      return sendError(res, "Username cannot be blank", 400, "username");
    const isExistingWithUsername = await User.findOne({
      username: { $ne: user.username, $eq: username },
    });
    if (isExistingWithUsername)
      return sendError(
        res,
        `Username ${isExistingWithUsername.username} has already been taken.`,
        400,
        "username"
      );

    // Check if password exist
    if (newPassword) {
      if (newPassword.length < 3)
        return sendError(
          res,
          "Password should contain at least 3 characters",
          400,
          "newPassword"
        );

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

      // Update user with new password
      await User.findByIdAndUpdate(
        id,
        {
          ...req.body,
          password: hashedNewPassword ? hashedNewPassword : user.password,
          bannedAt: banned && moment().format(formatTime),
        },
        { new: true }
      );
    }

    // Update user
    await User.findByIdAndUpdate(
      id,
      {
        ...req.body,
        bannedAt: banned && moment().format(formatTime),
      },
      { new: true }
    );

    // Get current user after updated
    const updatedUser = await User.findById(id).select("-__v -password");
    if (!updatedUser) return sendError(res, "User not found", 404);

    return sendSuccess(res, "Update user successfully", { user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const updateMoneyUserById = async (req, res, next) => {
  try {
    // Get data from request body
    const { money } = req.body;
    // Get user id from request params
    const { id } = req.params;
    // Get user logged in
    const { userId } = req;

    // Check if user not exists
    const user = await User.findById(id);
    if (!user) return sendError(res, "User not found", 404);

    // Validate
    if (!money) return sendError(res, "Money cannot be blank", 400, "money");
    if (!Number.isInteger(money))
      return sendError(res, "Money is not a valid number", 400, "money");
    if (money <= 0)
      return sendError(res, "Money must be greater than 0", 400, "money");

    // Update money user
    await User.findByIdAndUpdate(
      id,
      {
        ...req.body,
        money: user.money + money,
      },
      { new: true }
    );

    // Get current user after updated
    const updatedUser = await User.findById(userId).select("-__v -password");
    if (!updatedUser) return sendError(res, "User not found", 404);

    return sendSuccess(
      res,
      `Successfully added ${money} point${money > 1 ? "s" : ""} to account ${
        user.username
      }`,
      {
        user: updatedUser,
      }
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // Clear the cookie
    res.cookie("accessToken");

    // Send the response
    return sendSuccess(res, "User logged out successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    // Get id from params
    const { id } = req.params;
    // Get user id from request
    const { userId } = req;

    // Get user by id
    const user = await User.findById(id).select("-__v -password");
    if (!user) return sendError(res, "User not found", 404);
    if (user._id.toString() === userId)
      return sendError(res, "Cannot delete this user");

    // Delete user
    await User.findByIdAndDelete(id);

    // Get all users after delete
    const users = await User.find().select("-__v -password");

    // Send success notification
    return sendSuccess(res, "Delete user successfully", {
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
    return sendSuccess(res, "Get user successfully", user);
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
      return sendError(
        res,
        "Current Password cannot be blank",
        400,
        "currentPassword"
      );
    if (!newPassword)
      return sendError(res, "New Password cannot be blank", 400, "newPassword");

    // Get user
    const user = await User.findById(userId);
    if (!user) return sendError(res, "User not found", 404, "user");

    // Compare current password with old password
    const comparedCurrentPassword = bcrypt.compareSync(
      currentPassword,
      user.password
    );
    if (!comparedCurrentPassword)
      return sendError(
        res,
        "Current password is incorrect",
        400,
        "currentPassword"
      );

    // Compare new password with old password if new password is not empty
    let comparedNewPassword;
    if (newPassword) {
      comparedNewPassword = bcrypt.compareSync(newPassword, user.password);
    } else {
      // Send error notification
      return sendError(
        res,
        "The new password must be different from the old password",
        400,
        "newPassword"
      );
    }

    // Check if password is empty or not
    if (newPassword && !comparedNewPassword) {
      if (newPassword.length < 3)
        return sendError(
          res,
          "Password should contain at least 3 characters",
          400,
          "newPassword"
        );

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
      return sendSuccess(res, "Update password successfully", {
        user: updatedUser,
      });
    } else {
      // Send error notification
      return sendError(
        res,
        "The new password must be different from the old password",
        400,
        "newPassword"
      );
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
    return sendSuccess(res, "Retrieving users successfully", {
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
    if (!fullName)
      return sendError(res, "Full Name cannot be blank", 400, "fullName");
    if (!timezone)
      return sendError(res, "Timezone cannot be blank", 400, "timezone");

    // Get user
    const getUser = await User.findById(userId);
    // Check if user not exists
    if (!getUser) return sendError(res, "User not found", 404, "user");

    // Check if full name and timezone does not change
    if (fullName === getUser.fullName && timezone === getUser.timezone)
      return sendError(
        res,
        "The new full name or timezone must be different from the old full name or timezone",
        400,
        "fullName"
      );

    // Get user logged
    const user = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { new: true }
    ).select("-__v -password");

    // Send success notification
    return sendSuccess(res, "Update profile successfully", { user });
  } catch (error) {
    next(error);
  }
};
