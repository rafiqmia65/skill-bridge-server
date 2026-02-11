import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma.config";
import { logger } from "better-auth";

const port = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connect to the database successfully");

    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
      });
    }
  } catch (error: any) {
    logger.error("Error starting server:", error);
    process.exit(1);
  }
}

main();
