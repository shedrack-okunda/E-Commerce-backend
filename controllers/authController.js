import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendMail } from "../utils/Email.js";
import { generateOTP } from "../utils/GenerateOtp.js";
import OTP from "../models/OTP.js";
import { sanitizeUser } from "../utils/SanitizeUser.js";
import { generateToken } from "../utils/GenerateToken.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    let user = await User.findOne({ email });

    // if user already exists
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    // creating a new user
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    // getting secure user info
    const secureInfo = sanitizeUser(user);

    // generating jwt token
    const token = generateToken(secureInfo);

    // sending jwt token in the response cookies
    res.cookie("token", token, {
      sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
      maxAge:
        parseInt(process.env.COOKIE_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.PRODUCTION === "true",
    });

    res.status(201).json(sanitizeUser(user));
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error occurred during signup, please try again later",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists or not
    const user = await User.findOne({ email });

    // if user exists and password matches the hash
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.clearCookie("token");
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    // getting secure user info
    const secureInfo = sanitizeUser(user);

    // generate jwt token
    const token = generateToken(secureInfo);

    //   sending jwt token in the response cookies
    res.cookie("token", token, {
      sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
      maxAge:
        parseInt(process.env.COOKIE_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000,

      httpOnly: true,
      secure: process.env.PRODUCTION === "true",
    });

    return res
      .status(200)
      .json({ status: "SUCCESS", data: secureInfo, message: "User logged in" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Some error occurred while logging in, please try again later",
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    // checks if user id is existing in the user collection
    const user = await User.findById(userId);

    // if user id does not exists then returns a 404 response
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // checks if otp exists by that user id
    const isOtpExisting = await OTP.findOne({ user: userId });

    // if otp does not exists then returns a 404 response
    if (!isOtpExisting) {
      return res.status(404).json({ message: "Otp not found" });
    }

    // checks if the otp is expired, if yes then deletes the otp
    if (isOtpExisting.expiresAt < Date.now()) {
      await OTP.findByIdAndDelete(isOtpExisting._id);
      return res.status(400).json({ message: "Otp expired" });
    }

    // checks if otp is there and matches the hash value then updates the user verified status to true and returns the updated user
    const isOtpValid = await bcrypt.compare(otp, isOtpExisting.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Otp is invalid" });
    }

    await OTP.findByIdAndDelete(isOtpExisting._id);
    user.isVerified = true;
    await user.save();

    return res.status(200).json(sanitizeUser(user));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occurred" });
  }
};

export const resendOtp = async (req, res) => {
  const { user } = req.body;

  try {
    const existingUser = await User.findById(user);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await OTP.deleteMany({ user });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newOtp = new OTP({
      user,
      otp: hashedOtp,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });
    await newOtp.save();

    await sendMail(
      existingUser.email,
      `OTP Verification`,
      `Your OTP is: <b>${otp}</b>`,
    );

    res.status(201).json({ message: "OTP sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Some error occurred while resending otp, please try again later",
    });
  }
};

export const forgotPassword = async (req, res) => {
  let newToken;

  try {
    // checks if user provided email exists or not
    const isExistingUser = await User.findOne({ email: req.body.email });

    // if email does not exists returns a 404 response
    if (!isExistingUser) {
      return res
        .status(404)
        .json({ message: "Provided email does not exists" });
    }

    await PasswordResetToken.deleteMany({ user: isExistingUser._id });

    // if user exists, generates a password reset token
    const passwordResetToken = generateToken(
      sanitizeUser(isExistingUser),
      true,
    );

    // hashes the token
    const hashedToken = await bcrypt.hash(passwordResetToken, 10);

    // saves hashed token in passwordResetToken collection
    newToken = new PasswordResetToken({
      user: isExistingUser._id,
      token: hashedToken,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });
    await newToken.save();

    // sends the password reset link to the user's mail
    await sendMail(
      isExistingUser.email,
      "Password Reset Link for your account",
      `<p>Dear ${isExistingUser.name}, We received a request to reset the password for your account. If you initiated this request, please use the following link to reset your password:</p>
      <p><a href=${process.env.ORIGIN}/reset-password/${isExistingUser._id}/${passwordResetToken} target="_blank">Reset Password</a></p>
      <p>This link is valid for a limited time. if you did not request a password reset, please ignore this email. Your account security is important to us. Thank you.</p>`,
    );

    res
      .status(200)
      .json({ message: `Password Reset Link sent to ${isExistingUser.email}` });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while sending password reset link" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // checks if user exists
    const isExistingUser = await User.findById(req.body.userId);

    // if user does not exists then returns a 404 response
    if (!isExistingUser) {
      return res.status(404).json({ message: "User does not exists" });
    }

    // fetches the resetPassword token by the userId
    const isResetTokenExisting = await PasswordResetToken.findOne({
      user: isExistingUser._id,
    });

    // if token does not exists for that user then returns a 404 response
    if (!isResetTokenExisting) {
      return res.status(404).json({ message: "Reset link is not valid" });
    }

    // if the token has expired then deletes the token and send response
    if (isResetTokenExisting.expiresAt < new Date()) {
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
      return res.status(404).json({ message: "Reset Link has been expired" });
    }

    // if token exists and is not expired and token matches the hash, then resets the user password and deletes the token
    if (
      isResetTokenExisting &&
      isResetTokenExisting.expiresAt > new Date() &&
      (await bcrypt.compare(req.body.token, isResetTokenExisting.token))
    ) {
      // deleting the password reset token
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);

      //   resets the password after hashing it
      await User.findByIdAndUpdate(isExistingUser._id, {
        password: await bcrypt.hash(req.body.password, 10),
      });
      return res.status(200).json({ message: "Password updated successfully" });
    }

    return res.status(404).json({ message: "Reset link has been expired" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Error occurred while resetting the password, please try again later",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      maxAge: 0,
      sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
      httpOnly: true,
      secure: process.env.PRODUCTION === "true" ? true : false,
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
  }
};

export const checkAuth = async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      return res.status(200).json(sanitizeUser(user));
    }
    res.sendStatus(401);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
