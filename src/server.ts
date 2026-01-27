import app from "./app";
import { prisma } from "./lib/prisma.config";
const port = process.env.PORT || 5000;

async function main() {
  await prisma.$connect();
  console.log("Connect to the database successfully");

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  try {
  } catch (error: any) {
    console.log(error);
    process.exit(1);
  }
}

main();
