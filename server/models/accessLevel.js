import { model, Schema } from "mongoose";

const accessLevelSchema = new Schema(
  {
    category: {
      type: String,
      require: true,
      trim: true,
    },
    detail: {
      type: String,
      require: true,
      trim: true,
    },
    isGroupStage: {
      type: Boolean,
      default: false,
    },
    isLiveGroupStage: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("AccessLevel", accessLevelSchema);
