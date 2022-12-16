import { model, Schema } from "mongoose";

const teamSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Name cannot be blank."],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      require: [true, "Full name cannot be blank."],
      unique: true,
      trim: true,
    },
    flag: {
      type: String,
      require: [true, "Flag cannot be blank."],
      trim: true,
    },
  },
  { timestamps: true }
);

export default model("Team", teamSchema);
