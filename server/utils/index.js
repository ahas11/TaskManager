import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connection established")
  } catch (error) {
    console.log("DB Error" + error)
  }
};

export const createJWT = (RES, userID) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: "1d" });
  RES.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict", /*prevent CSRF attack*/
    maxAge: 1 * 24 * 60 * 60 * 1000 //1day
  })
}

