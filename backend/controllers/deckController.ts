import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import Deck from "../models/Deck";
import Flashcard from "../models/Flashcard";

const fetchDecks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      const decks = await Deck.find({ userId });
      const decksWithFlashcardCount = await Promise.all(
        decks.map(async (deck) => {
          const flashcardCount = await Flashcard.countDocuments({
            deckId: deck._id,
          });
          return {
            ...deck.toObject(),
            flashcardCount,
          };
        })
      );
      res.status(200).json({ decks: decksWithFlashcardCount });
    } else {
      res.status(400).json({ error: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: fetchDecks" });
  }
};

const createDeck = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name } = req.body;
    if (userId) {
      const deck = await Deck.create({
        name,
        userId,
      });
      res.status(200).json(deck);
    } else {
      res.status(400).json({ error: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: createDeck" });
  }
};

const editDeck = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { deckId, name, pinned } = req.body;

    if (userId) {
      const deck = await Deck.findOneAndUpdate(
        { _id: deckId },
        { name, pinned },
        { new: true } // This ensures the updated deck is returned
      );
      if (deck) {
        const flashcardCount = await Flashcard.countDocuments({
          deckId: deck._id,
        });

        res.status(200).json({ deck, flashcardCount });
      }
    } else {
      res.status(400).json({ error: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: editDeck" });
  }
};

const deleteDeck = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      const { deckId } = req.body;
      const deck = await Deck.findByIdAndDelete({ _id: deckId });
      if (!deck) {
        res.status(404).json({ error: "Deck not found or not authorized" });
        return;
      }
      // Delete associated flashcards
      await Flashcard.deleteMany({ deckId: deckId });
      res.status(200).json(deck);
    } else {
      res.status(400).json({ error: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: deleteDeck" });
  }
};

export { createDeck, deleteDeck, editDeck, fetchDecks };
