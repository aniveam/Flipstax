import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import Flashcard from "../models/Flashcard";

const fetchFlashcards = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const deckId = req.query.deckId as string;
    if (userId) {
      const flashcards = await Flashcard.find({ deckId });
      res.status(200).json(flashcards);
    } else {
      res.status(400).json({ error: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: fetchFlashcards" });
  }
};

const createFlashcard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      const { deckId, frontText, backText } = req.body;
      console.log(deckId, frontText, backText);
      const flashcard = await Flashcard.create({
        deckId,
        frontText,
        backText,
        lastReviewed: new Date(),
      });
      res.status(200).json(flashcard);
    } else {
      res.status(400).json({ error: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: createFlashcard" });
  }
};

export { createFlashcard, fetchFlashcards };
