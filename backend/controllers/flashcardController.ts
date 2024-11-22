import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import Deck from "../models/Deck";
import Flashcard from "../models/Flashcard";

const fetchFlashcards = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const deckId = req.query.deckId as string;
    if (userId) {
      const deck = await Deck.findById(deckId);
      if (!deck) {
        res.status(404).json({ error: "Deck not found" });
        return;
      }
      const flashcards = await Flashcard.find({ deckId });
      res.status(200).json({ flashcards, deckName: deck.name });
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

const editFlashcard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      flashcardId,
      favorited,
      frontText,
      backText,
      lastReviewed,
      repetitions,
      easeFactor,
      interval,
    } = req.body;
    if (userId) {
      const flashcard = await Flashcard.findOneAndUpdate(
        { _id: flashcardId },
        {
          favorited,
          frontText,
          backText,
          lastReviewed,
          repetitions,
          easeFactor,
          interval,
        },
        { new: true }
      );
      res.status(200).json(flashcard);
    } else {
      res.status(400).json({ error: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: deleteFlashcard" });
  }
};

const deleteFlashcard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      const { flashcardId } = req.body;
      const flashcard = await Flashcard.findByIdAndDelete({ _id: flashcardId });
      res.status(200).json(flashcard);
    } else {
      res.status(400).json({ error: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: deleteFlashcard" });
  }
};

export { createFlashcard, deleteFlashcard, editFlashcard, fetchFlashcards };
