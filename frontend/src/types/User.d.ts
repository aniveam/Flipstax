export default interface User {
  name?: string;
  email: string;
  password?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}
