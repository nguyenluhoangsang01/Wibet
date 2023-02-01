import bodyParser from "body-parser";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import betRoutes from "./routes/bet.js";
import commentRoutes from "./routes/comment.js";
import matchRoutes from "./routes/match.js";
import teamRoutes from "./routes/team.js";
import userRoutes from "./routes/user.js";

dotenv.config();

// Constants
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";

// Config app
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? process.env.API_BASE_ENDPOINT_CLIENT
        : [`http://${HOST}`, `https://${HOST}`],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up mongoose connect
mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) {
      console.log(error.message);
    } else {
      console.log("Connected to MongoDB successfully");
    }
  }
);

// Config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Server running
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/bet", betRoutes);
app.use("/api/comment", commentRoutes);

// Route not found
app.use("/*", (_, res) => {
  res.status(501).send("Not implemented");
});
