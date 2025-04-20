import express, { ErrorRequestHandler } from "express";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./notificationCleanupJob";
import swaggerSpec from "./swaggerConfig";
import swaggerUi from "swagger-ui-express";
import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import profileRoute from "./routes/profile.route";
import tagRoutes from "./routes/tag.route";
import gigRoutes from "./routes/gig.route";
import reviewsRoutes from "./routes/reviews.route";
import ordersGigRoutes from "./routes/orderGig.route";
import messageRoutes from "./routes/message.route";
import conversationRoutes from "./routes/conversation.route";
import jobRoutes from "./routes/job.route";
import bidRoutes from "./routes/bid.route";
import contactRoutes from "./routes/contract.route";
import ordersByContractRoutes from "./routes/orderByContract.route";
import notification from "./routes/notification.route";

import "./utils/cronJobs";

import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
mongoose.set("strictQuery", true);

export const app = express();
const PORT = process.env.PORT || 8800;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);

    io.to(roomId).emit(
      "roomUsers",
      Array.from(io.sockets.adapter.rooms.get(roomId) || [])
    );
  });

  socket.on("getRoomUsers", (roomId) => {
    const usersInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    socket.emit("roomUsers", usersInRoom);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

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

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/uploads", express.static("uploads"));
app.use("/api/profiles", profileRoute);
app.use("/api/tags", tagRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/orderGig", ordersGigRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/bid", bidRoutes);
app.use("/api/contract", contactRoutes);
app.use("/api/order-by-contract", ordersByContractRoutes);
app.use("/api/notification", notification);

const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  if (err.errors) {
    res.status(errorStatus).json({ message: errorMessage, errors: err.errors });
  }

  res.status(errorStatus).send(errorMessage);

  next();
};

app.use(errorHandler);

server.listen(PORT, () => {
  connect();
  console.log("Backend server is running!");
});

export { io };
