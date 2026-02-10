import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST register a new user
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const duplicate = await User.findOne({ email: cleanEmail });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        error: "Email already in use",
      });
    }

    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email: cleanEmail, password: encryptedPassword });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      response: {
        email: newUser.email,
        id: newUser._id,
        accessToken: newUser.accessToken,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Sorry, I could not create a user",
      response: error.message,
    });
  }
};

// POST login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const foundUser = await User.findOne({ email: cleanEmail });

    const isMatch = foundUser
      ? await bcrypt.compare(password, foundUser.password)
      : false;

    if (!foundUser || !isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      response: {
        email: foundUser.email,
        id: foundUser._id,
        accessToken: foundUser.accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      response: error.message,
    });
  }
};
