import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

// Import Routes
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";

config(); // Load environment variables from .env file

await connectDB(); // Connect to the database

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

const PORT = 5001;
const server = app.listen(PORT, async (error) => {
  if (error) {
    console.error(`Server failed to start on port ${PORT}:`, error);
    await disconnectDB();
    process.exit(1);
  }

  console.log(`Server is running on PORT ${PORT}`);
});

const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
};

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB(); // Disconnect from the database
    process.exit(1); // Exit the process with an error code
  });
});

// Handle uncaught exceptions (e.g., programming errors)
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB(); // Disconnect from the database
  process.exit(1); // Exit the process with an error code
});

// Graceful shutdown on SIGINT and SIGTERM signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
