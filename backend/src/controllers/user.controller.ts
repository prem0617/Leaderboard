import { Request, Response } from "express";
import UserModel from "../models/User.model";
import HistoryModel from "../models/History.model";
import { io } from "../socket/socket";

// Controller to create a new user
export async function createUser(req: Request, res: Response) {
  try {
    console.log(req.body);
    const { name } = await req.body;

    // If name is not provided, return a 400 Bad Request
    if (!name)
      return res
        .status(400)
        .json({ message: "Name is Requires Field.", success: false });

    const userData = { name };

    // Create new user in the database
    const newUser = await UserModel.create(userData);

    io.emit("newUser", newUser);

    // If user is successfully created, return 201 Created
    if (newUser)
      return res
        .status(201)
        .json({ message: "New user is created", success: true });
  } catch (error) {
    // Log error and return 500 Internal Server Error
    console.log(error);
    return res
      .status(500)
      .json({ message: "error in create user route", success: false });
  }
}

// Controller to get all users
export async function getUsers(req: Request, res: Response) {
  try {
    // Fetch all users from the database
    const users = await UserModel.find().sort({ totalPoints: -1 });

    if (users)
      return res
        .status(200) // 200 OK is more appropriate than 201 Created
        .json({ users, message: "Users fetched successfully", success: true });
  } catch (error) {
    // Log error and return 500 Internal Server Error
    console.log(error);
    return res
      .status(500)
      .json({ message: "error in get user route", success: false });
  }
}

export async function climeReward(req: Request, res: Response) {
  try {
    const { userId } = req.body;

    // Validate required userId
    if (!userId)
      return res.status(400).json({
        message: "userId is a required field",
        success: false,
      });

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    // Generate a random number between 1 and 10 for pointsClaimed
    const pointsClaimed = Math.floor(Math.random() * 10) + 1;

    // Create a new history record
    const newHistory = await HistoryModel.create({
      userId,
      pointsClaimed,
    });

    // Update user's total points
    user.totalPoints += pointsClaimed;
    await user.save();

    io.emit("pointUpdate", user);

    // Return success response

    return res.status(201).json({
      message: "Points claimed successfully",
      success: true,
      data: {
        userId: user._id,
        pointsClaimed,
        totalPoints: user.totalPoints,
        historyId: newHistory._id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in create history route",
      success: false,
    });
  }
}
