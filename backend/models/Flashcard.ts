import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

export interface IFlashcard extends Document {
  deckId: ObjectId;
  frontText: string;
  backText: string;
  favorited: boolean;
  lastReviewed: Date;
  repetitions: number;
  easeFactor: number;
  interval: number;
  createdAt: Date;
  updatedAt: Date;
}

const flashcardSchema = new Schema({
  deckId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Deck",
  },
  frontText: { type: String, required: true },
  backText: { type: String, required: true },
  favorited: { type: Boolean, default: false },
  lastReviewed: { type: Date },
  repetitions: { type: Number, default: 0 },
  easeFactor: { type: Number, default: 2.5 },
  interval: { type: Number },
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);
export default Flashcard;
