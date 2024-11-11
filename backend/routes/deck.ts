import express from "express";
import { createDeck, fetchDecks } from "../controllers/deckController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticateToken, fetchDecks);
router.post("/", authenticateToken, createDeck);

export default router;
