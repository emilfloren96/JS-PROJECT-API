import mongoose from "mongoose";
import crypto from "crypto";

const { Schema, model } = mongoose;

const generateToken = () => crypto.randomBytes(128).toString("hex");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    accessToken: {
      type: String,
      default: generateToken,
    },
  },
  { timestamps: true },
);

export const User = model("User", userSchema);
