import "dotenv/config";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";
const port = process.env.PORT || 5000;
// const port = parseInt(process.env.PORT || "5000", 10); // parseInt
// const HOST = "0.0.0.0"; // Render MUST

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    // Production- listen
    (app as any).listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error: any) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

main();
