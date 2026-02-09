import "dotenv/config";
import mongoose from "mongoose";
import { HappyThoughts } from "./models/Thought.js";

const dbUrl = process.env.MONGO_URL || "mongodb://localhost/js-project-api";

const initialThoughts = [
  { message: "Today is a great day to learn something new!" },
  { message: "I love coding with JavaScript", hearts: 5 },
  { message: "Happy thoughts make the world go round", hearts: 12 },
  { message: "Just finished a really cool project!", hearts: 3 },
  { message: "Coffee and code is the best combo", hearts: 8 },
  { message: "Never stop learning, never stop growing", hearts: 15 },
  { message: "Sunshine and good vibes today", hearts: 6 },
  { message: "Feeling grateful for amazing friends", hearts: 10 },
];

const runSeed = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database connection established");

    await HappyThoughts.deleteMany({});
    console.log("Previous thoughts removed");

    const inserted = await HappyThoughts.insertMany(initialThoughts);
    console.log(`Successfully seeded ${inserted.length} thoughts`);

    await mongoose.connection.close();
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Failed to seed database:", err.message);
    process.exit(1);
  }
};

runSeed();
