import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

const userSchema: Schema<IUser> = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: {type: String},
  googleId: { type: String, unique: true },
  createdAt: String,
  updatedAt: String,
});

const User = mongoose.model("User", userSchema);
export default User;
