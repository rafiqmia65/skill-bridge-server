import * as express from "express";

declare module "express" {
  export interface Request {
    user?: {
      id: string;
      role: "ADMIN" | "TUTOR" | "STUDENT";
      [key: string]: any;
    };
    // Express 5
    body: any;
    headers: any;
    params: any;
    query: any;
  }
}
