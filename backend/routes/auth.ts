import bcrypt from "bcryptjs";
import express, { Response } from "express";
import User from "../models/User";

const router = express.Router();

router.post("/register", async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      console.log(existingUser);
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    const date = new Date().toISOString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      googleId: email,
      createdAt: date,
      updatedAt: date,
    });
    await newUser.save();

    res.status(201).send({ message: "User registered successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
