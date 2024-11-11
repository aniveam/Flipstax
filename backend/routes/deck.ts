import express from "express";
import { createDeck } from "../controllers/deckController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticateToken, createDeck);

export default router;
