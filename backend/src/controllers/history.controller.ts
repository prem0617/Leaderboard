import { Request, Response } from "express";
import HistoryModel from "../models/History.model";
import UserModel from "../models/User.model";

// Controller to get all history records
export async function getHistory(req: Request, res: Response) {
  try {
    // Fetch all history records with populated user info
    const historyRecords = await HistoryModel.find().populate("userId", "name");

    return res.status(200).json({
      message: "History fetched successfully",
      success: true,
      data: historyRecords,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in get history route",
      success: false,
    });
  }
}
