import express from "express";
import cors from "cors"; // 👈 import cors
import "dotenv/config";
import connectDB from "./lib/conncetDb";

import userRoutes from "./routes/user.route";
import historyRoutes from "./routes/history.route";
import { app, server } from "./socket/socket";

const PORT = 3000;

// ✅ Allow CORS from React frontend (default: http://localhost:5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow cookies/authorization headers
  })
);

app.use(express.json());

app.use("/user", userRoutes);
app.use("/history", historyRoutes);

app.get("/", (_req, res) => {
  res.send("Hello TypeScript + Express!");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
