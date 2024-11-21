import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
// import { sanitizeUser } from "../utils/SanitizeUser.js";

export const verifyToken = async (req, res, next) => {
  try {
    // extract the token from request cookies
    const { token } = req.cookies || {};

    // if no token returns 401 response
    if (!token) {
      return res
        .status(401)
        .json({ message: "Token missing, please login again" });
    }

    // verifies the token
    const decodedInfo = jwt.verify(token, process.env.SECRET_KEY);

    // checks if decoded info contains legit details, then set that info in req.user and calls next
    if (decodedInfo?.id && decodedInfo?.email) {
      req.user = decodedInfo;
      return next();
    }

    // if token is invalid then sends the response accordingly
    return res
      .status(401)
      .json({ message: "Invalid Token, please login again" });
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Invalid Token, please login again" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
