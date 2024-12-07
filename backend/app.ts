import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import deckRoutes from "./routes/deck";
import flashcardRoutes from "./routes/flashcard";
import folderRoutes from "./routes/folder";

dotenv.config();

const PORT = process.env.PORT || 9756;
const app = express();
const prodOrigins = [process.env.ORIGIN_1, process.env.ORIGIN_2];
const devOrigin = ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        prodOrigins.includes(origin) ||
        devOrigin.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/decks", deckRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/folders", folderRoutes);

async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB...");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Stop the application if MongoDB connection fails
  }
}
connectToMongo();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
