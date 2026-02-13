// src/types/express.ts
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { ParamsDictionary } from "express-serve-static-core";

/**
 * AppResponse: fully typed Express response
 */
export interface AppResponse extends ExpressResponse {}

/**
 * Request that includes a logged-in user object
 */
export interface RequestWithUser<
  TBody = any,
  TParams extends ParamsDictionary = ParamsDictionary,
  TQuery = any,
> extends ExpressRequest<TParams, any, TBody, TQuery> {
  user?: {
    id: string;
    role?: string; // ADMIN/TUTOR/STUDENT
    [key: string]: any;
  };
}

/**
 * Request that includes a typed body (for POST/PUT requests)
 */
export interface RequestWithBody<TBody = any> extends ExpressRequest<
  any,
  any,
  TBody
> {
  headers: Record<string, string | string[] | undefined>;
  method: string;
}

/**
 * Request that includes typed route params (for GET /:id)
 */
export interface RequestWithParams<
  TParams extends ParamsDictionary = ParamsDictionary,
> extends ExpressRequest<TParams> {}

/**
 * Request that includes both body and route params (for PUT/PATCH)
 */
export interface RequestWithBodyAndParams<
  TBody = any,
  TParams extends ParamsDictionary = ParamsDictionary,
> extends ExpressRequest<TParams, any, TBody> {}

/**
 * Request that includes only headers (for proxying auth requests)
 */
export interface RequestWithHeaders extends ExpressRequest {
  headers: Record<string, string | string[] | undefined>;
}
