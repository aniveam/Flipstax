import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import Deck from "../models/Deck";

const createDeck = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name } = req.body;
    if (userId) {
      const newDeck = new Deck({
        name,
        userId,
      });
      await newDeck.save();
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: Deck" });
  }
};

export { createDeck };
