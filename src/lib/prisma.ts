import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
// ** Local right import
// import { PrismaClient } from "../../generated/prisma/client";



// vercel need this import
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
