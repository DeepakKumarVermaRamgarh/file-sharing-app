// necessary modules and functions import
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import cors from "cors";
import fileRouter from "./routes/file.route.js";

// env configuration
dotenv.config({ path: "./config/config.env" });

// creating app server
const app = express();

// connecting to database
connectDB();

// middlewares
app.use(cors());
app.use("/api/v1", fileRouter);

// listening on port
app.listen(process.env.PORT, () => {
  console.log(`Server is up and running on port @${process.env.PORT}`);
});
