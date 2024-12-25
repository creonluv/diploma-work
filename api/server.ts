import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerSpec from "./swaggerConfig";
import swaggerUi from "swagger-ui-express";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
mongoose.set("strictQuery", true);

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const connect = async () => {
  try {
    if (!process.env.MONGO) {
      throw new Error("MongoDB connection string is not defined in .env file");
    }

    await mongoose.connect(process.env.MONGO);

    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.listen(PORT, () => {
  connect();
  console.log("Backend server is running!");
});