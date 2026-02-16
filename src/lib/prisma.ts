import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

let PrismaClientClass: any;

if (process.env.NODE_ENV === "production") {
  PrismaClientClass = require("@prisma/client").PrismaClient;
} else {
  PrismaClientClass = (await import("../../generated/prisma/client.js"))
    .PrismaClient;
}
// Connection string
const connectionString = process.env.DATABASE_URL as string;

// Create PrismaPg adapter
const adapter = new PrismaPg({ connectionString });

// Initialize Prisma client with adapter
const prisma = new PrismaClientClass({ adapter });

export { prisma };
