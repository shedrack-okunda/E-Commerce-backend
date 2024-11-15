import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import brandRoutes from "./routes/brandRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import userRoutes from "./routes/userRoute.js";
import addressRoutes from "./routes/addressRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";
import wishlistRoutes from "./routes/wishlistRoute.js";

const app = express();

const port = process.env.PORT;
const db = process.env.MONGO_URI;

// database connection
mongoose
  .connect(db, {})
  .then(() => console.log("Connected to db"))
  .catch((error) => console.log("Error:", error));

// middlewares
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

// route middleware
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/brands", brandRoutes);
app.use("/categories", categoryRoutes);
app.use("/address", addressRoutes);
app.use("/reviews", reviewRoutes);
app.use("/wishlist", wishlistRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "running" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
