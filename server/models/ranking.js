import { model, Schema } from "mongoose";

const rankingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    bet: {
      type: Schema.Types.ObjectId,
      ref: "Bet",
    },
    betTimes: Number,
    winTimes: Number,
    winRate: Number,
    total: Number,
  },
  { timestamps: true }
);

export default model("Ranking", rankingSchema);
