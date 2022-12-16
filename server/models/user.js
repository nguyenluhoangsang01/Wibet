import { model, Schema } from "mongoose";
import { ROLES, STATUS } from "../constants";

const userSchema = new Schema(
  {
    email: {
      type: String,
      require: [true, "Email cannot be blank."],
      trim: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Email is not a valid email address.",
      ],
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
      type: String,
      trim: true,
    },
    roleID: {
      type: String,
      enum: Object.keys(ROLES),
      default: Object.keys(ROLES)[1],
    },
    status: {
      type: String,
      enum: Object.keys(STATUS),
      default: Object.keys(ROLES)[0],
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
