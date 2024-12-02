import axios from "axios";
import { hash, compareSync } from "bcryptjs";
import { Response, Router } from "express";
import { sign } from "jsonwebtoken";
import User from "../models/User";

const router = Router();

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
    const hashedPassword = await hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      googleId: email,
      createdAt: date,
      updatedAt: date,
    });
    await newUser.save();

    res
      .status(201)
      .send({ message: "User registered successfully!", user: newUser });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && compareSync(password, user.password || "")) {
      const token = sign({ id: user._id }, process.env.JWT_TOKEN as string);
      res.status(200).send({ token, user });
    } else {
      res.status(400).send({ error: "Invalid credentials" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Login failed" });
  }
});

router.post("/google-signin", async (req, res: Response) => {
  try {
    const { token } = req.body;
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
    );
    const { email, name, sub: googleId } = response.data;
    const date = new Date().toISOString();

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name,
        googleId,
        createdAt: date,
        updatedAt: date,
      });
      await user.save();
    }
    const jwtToken = sign({ id: user._id }, process.env.JWT_TOKEN as string);
    res.status(200).json({ token: jwtToken, user });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Google Signin failed" });
  }
});

export default router;
