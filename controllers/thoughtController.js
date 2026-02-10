import mongoose from "mongoose";
import { HappyThoughts } from "../models/Thought.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all thoughts with optional filtering, sorting, and pagination
export const getThoughts = async (req, res) => {
  try {
    const filter = {};

    // Filter by minimum hearts
    if (req.query.minHearts) {
      const parsedMin = Number(req.query.minHearts);
      if (Number.isNaN(parsedMin)) {
        return res.status(400).json({ error: "minHearts must be a number" });
      }
      filter.hearts = { $gte: parsedMin };
    }

    // Filter by category
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Sorting — default by newest first
    const sortField = req.query.sort === "hearts" ? "hearts" : "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    // Pagination with skip/limit
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const total = await HappyThoughts.countDocuments(filter);
    const thoughts = await HappyThoughts.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    return res.json({
      thoughts,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET a single thought by id
export const getThoughtById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const thought = await HappyThoughts.findById(id);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    return res.json(thought);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST create a new thought
export const createThought = async (req, res) => {
  const { message, category } = req.body;

  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({
      error: "Message is required and must be between 5 and 140 characters",
    });
  }

  try {
    const thought = await HappyThoughts.create({
      message,
      category: category || "general",
      userId: req.user._id,
    });
    return res.status(201).json(thought);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// PUT update a thought
export const updateThought = async (req, res) => {
  const { id } = req.params;
  const { message, category } = req.body;

  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({
      error: "Message is required and must be between 5 and 140 characters",
    });
  }

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const thought = await HappyThoughts.findById(id);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    if (thought.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to update this thought" });
    }

    thought.message = message;
    if (category) {
      thought.category = category;
    }
    await thought.save();

    return res.json(thought);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// DELETE a thought
export const deleteThought = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const thought = await HappyThoughts.findById(id);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    if (thought.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this thought" });
    }

    await HappyThoughts.findByIdAndDelete(id);
    return res.json({ message: "Thought deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST like a thought
export const likeThought = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const thought = await HappyThoughts.findByIdAndUpdate(
      id,
      { $inc: { hearts: 1 } },
      { new: true },
    );

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    return res.json(thought);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
