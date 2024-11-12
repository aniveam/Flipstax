import express from "express";
import {
  createFlashcard,
  deleteFlashcard,
  fetchFlashcards,
} from "../controllers/flashcardController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticateToken, fetchFlashcards);
router.post("/", authenticateToken, createFlashcard);
router.delete("/", authenticateToken, deleteFlashcard);

export default router;
