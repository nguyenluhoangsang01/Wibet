import { model, Schema } from "mongoose";

const commentSchema = new Schema({}, { timestamps: true });

export default model("Comment", commentSchema);
