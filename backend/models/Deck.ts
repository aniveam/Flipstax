import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

export interface IDeck extends Document {
  name: string;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
}

const deckSchema: Schema<IDeck> = new Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    pinned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Deck = mongoose.model("Deck", deckSchema);
export default Deck;
