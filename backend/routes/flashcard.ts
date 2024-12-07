import { Router } from "express";
import {
  createFlashcard,
  deleteFlashcard,
  editFlashcard,
  fetchFlashcards,
} from "../controllers/flashcardController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateToken, fetchFlashcards);
router.post("/", authenticateToken, createFlashcard);
router.put("/", authenticateToken, editFlashcard);
router.delete("/", authenticateToken, deleteFlashcard);

export default router;
