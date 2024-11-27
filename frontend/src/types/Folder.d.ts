import { ObjectId } from "mongodb";

interface Folder {
  _id: string;
  color: string;
  name: string;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export default Folder;
