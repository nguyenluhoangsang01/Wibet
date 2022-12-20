import { model, Schema } from "mongoose";

const betSchema = new Schema(
  {
    option: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    money: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model("Bet", betSchema);
