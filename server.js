import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import thoughtRouter from "./routes/thoughtRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL, // Set this to your deployed frontend URL (e.g. https://your-app.pages.dev)
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
}));
app.use(express.json());

const mongoUri = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    console.log("Establishing database connection...");
    await mongoose.connect(mongoUri);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};
connectDB();

app.get("/", (_req, res) => {
  const availableEndpoints = listEndpoints(app);
  res.json({
    message: "Welcome to the Happy Thoughts API!",
    endpoints: availableEndpoints,
  });
});

app.use("/api/thoughts", thoughtRouter);
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
