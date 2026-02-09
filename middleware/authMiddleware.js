import { User } from "../models/User.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authorization = req.header("Authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication missing or invalid.",
        loggedOut: true,
      });
    }

    const accessToken = authorization.replace("Bearer ", "").trim();
    const matchedUser = await User.findOne({ accessToken });

    if (!matchedUser) {
      return res.status(401).json({
        message: "Authentication missing or invalid.",
        loggedOut: true,
      });
    }

    req.user = matchedUser;
    return next();
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
