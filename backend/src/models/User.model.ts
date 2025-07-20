import mongoose from "mongoose";

// Interface for the user model which has name and totalpoints
interface User {
  name: string;
  totalPoints: number;
}

// schema of the user
const UserSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// model of user
const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
