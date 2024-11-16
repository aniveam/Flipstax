import { ObjectId } from "mongodb";

interface Deck {
  _id: string;
  name: string;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  flashcardCount: number; //Only persisted in redux not in mongodb
  pinned: boolean;
}

export default Deck;
