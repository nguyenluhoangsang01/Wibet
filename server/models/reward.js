import { model, Schema } from "mongoose";

const rewardSchema = new Schema(
  {
    rewardName: {
      type: String,
      require: true,
    },
    numberOfReward: {
      type: Number,
      require: true,
    },
    rewardRate: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export default model("Reward", rewardSchema);
