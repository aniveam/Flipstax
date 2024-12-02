import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
  name?: string;
}

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Auth token empty" });
    return;
  }
  try {
    jwt.verify(token, process.env.JWT_TOKEN as string, (err, user) => {
      if (err) {
        res.status(403).json({ error: "Auth token denied" });
        return;
      }
      req.user = user as UserPayload;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { AuthenticatedRequest, authenticateToken };
