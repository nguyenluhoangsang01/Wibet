import { model, Schema } from "mongoose";
import { ROLES, STATUS } from "../constants.js";
import { isValidEmail } from "../helpers/isValidEmail.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      require: [true, "Email can not be blank"],
      trim: true,
      unique: true,
      validate(value) {
        if (!isValidEmail(value)) {
          throw new Error("Email is not a valid email address");
        }
      },
    },
    fullName: String,
    username: {
      type: String,
      require: [true, "Username can not be blank"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      minLength: [3, "Password should contain at least 3 characters"],
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
    bannedReason: String,
    loggedInAt: String,
    createdBy: {
      type: String,
      default: "Admin",
    },
    bannedAt: String,
    loggedInAt: String,
    timezone: {
      type: String,
      default: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    banned: {
      type: Boolean,
      default: false,
    },
    loggedInIp: String,
    createdIp: String,
    betTimes: {
      type: Number,
      default: 0,
    },
    winTimes: {
      type: Number,
      default: 0,
    },
    betMoney: {
      type: Number,
      default: 0,
    },
    match: Array,
    wrongPassword: {
      type: Number,
      default: 0,
    },
    accessToken: String,
    // isLogging: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
