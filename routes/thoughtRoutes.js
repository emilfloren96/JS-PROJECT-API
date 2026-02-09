import express from "express";
import mongoose from "mongoose";
import { HappyThoughts } from "../models/Thought.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Fetch all thoughts, with optional filtering by minimum hearts
router.get("/", async (_req, res) => {
  try {
    const filter = {};

    if (_req.query.minHearts) {
      const parsedMin = Number(_req.query.minHearts);
      if (Number.isNaN(parsedMin)) {
        return res.status(400).json({ error: "minHearts must be a number" });
      }
      filter.hearts = { $gte: parsedMin };
    }

    const allThoughts = await HappyThoughts.find(filter).sort({
      createdAt: "desc",
    });
    return res.json(allThoughts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Fetch a single thought by its id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const singleThought = await HappyThoughts.findById(id);
    if (!singleThought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    return res.json(singleThought);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create a new thought (requires authentication)
router.post("/", authenticateUser, async (req, res) => {
  const { message } = req.body;

  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({
      error: "Message is required and must be between 5 and 140 characters",
    });
  }

  try {
    const createdThought = await HappyThoughts.create({
      message,
      userId: req.user.id,
    });
    return res.status(201).json(createdThought);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update an existing thought (requires authentication + ownership)
router.put("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({
      error: "Message is required and must be between 5 and 140 characters",
    });
  }

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const existingThought = await HappyThoughts.findById(id);
    if (!existingThought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    if (existingThought.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this thought" });
    }

    existingThought.message = message;
    await existingThought.save();

    return res.json(existingThought);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete a thought (requires authentication + ownership)
router.delete("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const targetThought = await HappyThoughts.findById(id);
    if (!targetThought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    if (targetThought.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this thought" });
    }

    await HappyThoughts.findByIdAndDelete(id);
    return res.json({ message: "Thought deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Like a thought (increment hearts by 1)
router.post("/:id/like", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const likedThought = await HappyThoughts.findByIdAndUpdate(
      id,
      { $inc: { hearts: 1 } },
      { new: true },
    );

    if (!likedThought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    return res.json(likedThought);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
