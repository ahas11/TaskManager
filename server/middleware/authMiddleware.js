import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  console.log("protectRoute middleware called"); // Add this log
  try {
    let token = req.cookies?.token;
    console.log("Token:", token); // Log the token

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decodedToken); // Log the decoded token

      const user = await User.findById(decodedToken.userID).select(
        "isAdmin email"
      );
      console.log("User Response:", user); // Log the user response

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }

      req.user = {
        email: user.email,
        isAdmin: user.isAdmin,
        userID: decodedToken.userID,
      };

      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }
  } catch (error) {
    console.error("Protect Route Error:", error); // Improved error logging
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { isAdminRoute, protectRoute };
