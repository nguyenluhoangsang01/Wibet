import { model, Schema } from "mongoose";
import validator from "validator";
import { ROLES, STATUS } from "../constants.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      require: [true, "Email cannot be blank."],
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!");
        }
      },
    },
    fullName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      require: [true, "Username cannot be blank."],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      minLength: [3, "Password should contain at least 3 characters."],
    },
    money: {
      type: Number,
      trim: true,
      default: 200,
    },
    roleID: {
      type: String,
      enum: Object.keys(ROLES),
      default: Object.keys(ROLES)[1],
    },
    status: {
      type: String,
      enum: Object.keys(STATUS),
      default: Object.keys(STATUS)[0],
    },
    bannedReason: {
      type: String,
      trim: true,
    },
    loggedInAt: String,
    createdBy: String,
    bannedAt: String,
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
