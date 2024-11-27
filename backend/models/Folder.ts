import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

export interface IFolder extends Document {
  name: string;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

const folderSchema: Schema<IFolder> = new Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    color: { type: String },
  },
  { timestamps: true }
);

const Folder = mongoose.model("Folder", folderSchema);
export default Folder;
