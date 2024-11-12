import express from "express";
import {
  createFlashcard,
  fetchFlashcards,
} from "../controllers/flashcardController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticateToken, fetchFlashcards);
router.post("/", authenticateToken, createFlashcard);

export default router;
