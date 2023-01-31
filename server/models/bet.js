import { model, Schema } from "mongoose";

const betSchema = new Schema(
  {
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      require: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    match: {
      type: Schema.Types.ObjectId,
      ref: "Match",
      require: true,
    },
    money: {
      type: Number,
      default: 50,
    },
    betTime: String,
  },
  { timestamps: true }
);

export default model("Bet", betSchema);
