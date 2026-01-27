import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Skill Bridge App is running successfully",
  });
});

export default app;
