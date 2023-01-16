import { model, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    content: {
      type: String,
      require: true,
      trim: true,
    },
    picture: String,
  },
  { timestamps: true }
);

export default model("Comment", commentSchema);
