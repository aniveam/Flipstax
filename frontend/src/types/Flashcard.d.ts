interface Flashcard {
  _id: string;
  deckId: string;
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

export default Flashcard;
