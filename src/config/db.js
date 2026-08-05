import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected via Prisma successfully");
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1); // Exit the process with an error code
  }
};
const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("Database disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting from the database:", error);
  }
};

export { prisma, connectDB, disconnectDB };
