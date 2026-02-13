import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

let PrismaClient: any;

try {
  // Local dev
  PrismaClient = require("../../generated/prisma/client.js").PrismaClient;
} catch {
  // Vercel / Remote
  PrismaClient = require("@prisma/client").PrismaClient;
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export { prisma };
