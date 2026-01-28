import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import authProxyRoutes from "./modules/auth/auth.proxy.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Proxy routes for register/login + /me
app.use("/api/auth", authProxyRoutes);

// Catch-all for Better Auth internal routes
app.all("/api/auth/*split", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Skill Bridge App is running successfully",
  });
});

export default app;
