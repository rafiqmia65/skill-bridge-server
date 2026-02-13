import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// ** This is local development only, in production we will use the generated Prisma client directly
// import { PrismaClient } from "../../generated/prisma/client.js";

// ** Use `any` because Prisma 7.3 does not export `PrismaClient` as a named TS type
// ** eslint-disable-next-line @typescript-eslint/no-explicit-any
//  ** this is a vercel and render compatible way to import PrismaClient without breaking the build
const PrismaClient: any = require("@prisma/client").PrismaClient;

// Connection string
const connectionString = process.env.DATABASE_URL as string;

// Create PrismaPg adapter
const adapter = new PrismaPg({ connectionString });

// Initialize Prisma client with adapter
const prisma = new PrismaClient({ adapter });

export { prisma };
