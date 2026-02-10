import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  getThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  likeThought,
} from "../controllers/thoughtController.js";

const router = express.Router();

router.get("/", getThoughts);
router.get("/:id", getThoughtById);
router.post("/", authenticateUser, createThought);
router.put("/:id", authenticateUser, updateThought);
router.delete("/:id", authenticateUser, deleteThought);
router.post("/:id/like", likeThought);

export default router;
