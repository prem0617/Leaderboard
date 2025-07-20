import express from "express";
import { getHistory } from "../controllers/history.controller";
const router = express.Router();

router.get("/", getHistory);

export default router;
