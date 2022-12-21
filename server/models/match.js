import { model, Schema } from "mongoose";

const matchSchema = new Schema(
  {
    team1: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    resultOfTeam1: Number,
    team2: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    resultOfTeam2: Number,
    matchDate: {
      type: Date,
      require: [true, "Match Date cannot be blank."],
    },
    rate: {
      type: String,
      require: [true, "Rate cannot be blank."],
      trim: true,
    },
    description: String,
  },
  { timestamps: true }
);

export default model("Match", matchSchema);
