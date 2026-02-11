import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma.config";
import { logger } from "better-auth";

const port = parseInt(process.env.PORT || "5000", 10); // parseInt
const HOST = "0.0.0.0"; // Render MUST

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    // Production- listen
    app.listen(port, HOST, () => {
      logger.info(`🚀 Server running on http://${HOST}:${port}`);
    });
  } catch (error: any) {
    logger.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

main();
