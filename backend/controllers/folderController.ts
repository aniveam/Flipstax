import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import Deck from "../models/Deck";
import Folder from "../models/Folder";

const fetchFolders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      const folders = await Folder.find({ userId });
      res.status(200).send({ folders: folders });
    } else {
      res.status(400).send({ message: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error: fetchFolders" });
  }
};

const createFolder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, color } = req.body;
    if (userId) {
      const folder = await Folder.create({
        name,
        userId,
        color,
      });
      res.status(200).json(folder);
    } else {
      res.status(400).json({ error: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error: createFolder" });
  }
};

const editFolder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { _id, name, color } = req.body;
    if (userId) {
      const folder = await Folder.findOneAndUpdate(
        { _id: _id },
        { name, color },
        { new: true }
      );
      res.status(200).json(folder);
    } else {
      res.status(400).json({ error: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error: editFolder" });
  }
};

const deleteFolder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      const { folderId } = req.body;
      const folder = await Folder.findByIdAndDelete({ _id: folderId });
      if (!folder) {
        res.status(404).json({ error: "Folder not found or not authorized" });
        return;
      }
      //Need to remove this folderId from all decks that may have it
      await Deck.updateMany(
        { folderIds: folderId },
        { $pull: { folderIds: folderId } }
      );
      res.status(200).json(folder);
    } else {
      res.status(400).send({ message: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error: deleteFolder" });
  }
};

export { createFolder, deleteFolder, editFolder, fetchFolders };
