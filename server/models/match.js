import { model, Schema } from "mongoose";

const matchSchema = new Schema(
  {
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  { timestamps: true }
);

export default model("Match", matchSchema);
