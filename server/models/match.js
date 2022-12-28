import { model, Schema } from "mongoose";

const matchSchema = new Schema(
  {
    team1: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      require: true,
    },
    resultOfTeam1: Number,
    team2: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      require: true,
    },
    resultOfTeam2: Number,
    matchDate: {
      type: Date,
      require: [true, "Match Date cannot be blank."],
    },
    rate: {
      type: Number,
      require: [true, "Rate cannot be blank."],
      trim: true,
    },
    description: String,
    result: String,
    isShow: {
      type: Boolean,
      default: false,
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("Match", matchSchema);
