import { model, Schema } from "mongoose";

const matchSchema = new Schema(
  {
    team1: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Team",
    },
    team2: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Team",
    },
    resultOfTeam1: Number,
    resultOfTeam2: Number,
    statusOfTeam1: {
      type: Number,
      default: 0,
    },
    statusOfTeam2: {
      type: Number,
      default: 0,
    },
    matchDate: {
      type: Date,
      require: [true, "Match Date can not be blank"],
    },
    rate: {
      type: Number,
      require: [true, "Rate can not be blank"],
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
