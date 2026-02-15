import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "ADMIN" | "TUTOR" | "STUDENT";
        [key: string]: any;
      };
    }
  }
}

export {};
