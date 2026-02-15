import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "ADMIN" | "TUTOR" | "STUDENT";
        [key: string]: any;
      };
      body?: any; // optional, safer if you add route-specific types
    }
  }
}
