import express from "express";
import {
  climeReward,
  createUser,
  getUsers,
} from "../controllers/user.controller";
const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.post("/claimPoint", climeReward);

export default router;
