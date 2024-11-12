import express from "express";
import {
  createDeck,
  deleteDeck,
  fetchDecks,
} from "../controllers/deckController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticateToken, fetchDecks);
router.post("/", authenticateToken, createDeck);
router.delete("/", authenticateToken, deleteDeck);

export default router;
