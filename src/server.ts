import "dotenv/config";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
