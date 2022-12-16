import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user.js";

const PORT = process.env.PORT || 8000;

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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
      console.log("Connected to MongoDB successfully!");
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});

app.use("/api/user", userRoutes);

app.use("/*", (req, res) => {
  res.status(501).send("Not implemented.");
});
