import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Connection string
const connectionString = process.env.DATABASE_URL as string;

// Create PrismaPg adapter
const adapter = new PrismaPg({ connectionString });

// Initialize Prisma client with adapter
const prisma = new PrismaClient({ adapter });

export { prisma };
