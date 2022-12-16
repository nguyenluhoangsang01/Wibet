import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
// import swaggerUI from "swagger-ui-express";
import userRoutes from "./routes/user.js";
// import swaggerDocs from "./swaggerDocs.json" assert { type: "json" };

// Constants
const PORT = process.env.PORT || 8000;

// Config
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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
      console.log("Connected to MongoDB successfully!");
    }
  }
);

// Server running
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

// Swagger
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Routes
app.use("/api/user", userRoutes);

// Route not found
app.use("/*", (_, res) => {
  res.status(501).send("Not implemented.");
});
