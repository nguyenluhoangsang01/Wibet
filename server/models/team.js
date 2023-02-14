import { model, Schema } from "mongoose";
import { DEFAULT_IMAGE } from "../constants.js";

const teamSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Name can not be blank"],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      require: [true, "Full name can not be blank"],
      unique: true,
      trim: true,
    },
    flag: {
      type: String,
      trim: true,
      default: DEFAULT_IMAGE,
    },
  },
  { timestamps: true }
);

export default model("Team", teamSchema);
