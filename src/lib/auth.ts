import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

const productionOrigins = [
  process.env.APP_URL,
  process.env.PROD_APP_URL,
].filter(Boolean) as string[];

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
        bearer(), // <--- Add this here
    ],
  trustedOrigins:
    process.env.NODE_ENV === "production"
      ? productionOrigins
      : ["*"],
  // --- ADD THIS SECTION ---
  cookie: {
      name: "better-auth",
      attributes: {
        sameSite: "none", // Allows cross-site cookie sharing
        secure: true,     // Required when sameSite is 'none'
      }
    },    
  basePath: "/api/auth",    
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
 session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
  },
});
