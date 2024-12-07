import { Router } from "express";
import {
  createFolder,
  deleteFolder,
  editFolder,
  fetchFolders,
} from "../controllers/folderController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateToken, fetchFolders);
router.post("/", authenticateToken, createFolder);
router.put("/", authenticateToken, editFolder);
router.delete("/", authenticateToken, deleteFolder);

export default router;
