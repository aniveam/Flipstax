import { Router } from "express";
import {
  createDeck,
  deleteDeck,
  editDeck,
  fetchDecks,
} from "../controllers/deckController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateToken, fetchDecks);
router.post("/", authenticateToken, createDeck);
router.delete("/", authenticateToken, deleteDeck);
router.put("/", authenticateToken, editDeck);

export default router;
