import { model, Schema } from "mongoose";

const rankingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model("Ranking", rankingSchema);
