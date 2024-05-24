import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (!decodedToken.userID) {
        return res
          .status(400)
          .json({
            status: false,
            message: "Decoded token does not contain userID",
          });
      }

      const resp = await User.findById(decodedToken.userID).select(
        "isAdmin email"
      );

      if (!resp) {
        return res
          .status(404)
          .json({ status: false, message: "User not found in database" });
      }

      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin,
        userId: decodedToken.userID,
      };


      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }
  } catch (error) {
    console.error("Protect Route Error:", error);
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
