import express from "express";
const router = express.Router();
import {
  signup,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  logout,
  checkAuth,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

router
  .post("/signup", signup)
  .post("/login", login)
  .post("/verify-otp", verifyOtp)
  .post("/resend-otp", resendOtp)
  .post("/forgot-password", forgotPassword)
  .post("/reset-password", resetPassword)
  .get("/check-auth", verifyToken, checkAuth)
  .get("/logout", logout);

const authRoutes = router;
export default authRoutes;
