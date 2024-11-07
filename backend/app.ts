import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.port || 5000;
const app = express();
app.use(cors());
app.use(express.json());

//Routes

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
