import { model, Schema } from "mongoose";

const rewardSchema = new Schema(
  {
    rewardName: {
      type: String,
      require: true,
      trim: true,
    },
    numberOfReward: {
      type: Number,
      require: true,
      trim: true,
    },
    rewardRate: {
      type: String,
      require: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default model("Reward", rewardSchema);
