import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

/**
 * Standard Express response with TS support for res.status(), res.json(), etc.
 */
export type AppResponse = ExpressResponse;

/**
 * Request that includes a logged-in user object
 * Useful for private routes where user info is attached by auth middleware
 */
export interface RequestWithUser<
  TBody = any,
  TParams = any,
  TQuery = any,
> extends ExpressRequest {
  user?: {
    id: string;
    role?: string; // optional, can be ADMIN/TUTOR/STUDENT
    [key: string]: any;
  };
  body: TBody;
  params: TParams;
  query: TQuery;
}

/**
 * Request that includes a typed body
 * Useful for POST/PUT requests
 */
export interface RequestWithBody<TBody = any> extends ExpressRequest {
  body: TBody;
  headers: Record<string, string | string[] | undefined>; // ensures type-safe headers
  method: string; // request method
}

/**
 * Request that includes typed route params
 * Useful for GET /:id type routes
 */
export interface RequestWithParams<TParams = any> extends ExpressRequest {
  params: TParams;
}

/**
 * Request that includes both body and route params
 * Useful for PUT/PATCH routes with URL params
 */
export interface RequestWithBodyAndParams<
  TBody = any,
  TParams = any,
> extends ExpressRequest {
  body: TBody;
  params: TParams;
}

/**
 * Request that includes only headers (e.g., for auth proxying)
 */
export interface RequestWithHeaders extends ExpressRequest {
  headers: Record<string, string | string[] | undefined>;
}
