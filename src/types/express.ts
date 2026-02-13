import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { ParamsDictionary } from "express-serve-static-core";

/**
 * Fully typed Express response
 */
export interface AppResponse extends ExpressResponse {}

/**
 * Request that includes a typed body
 */
export interface RequestWithBody<TBody = any> extends ExpressRequest<
  any,
  any,
  TBody
> {
  body: TBody; // <-- now TS knows req.body exists
}

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
    role?: string; // ADMIN / TUTOR / STUDENT
    [key: string]: any;
  };
  body: TBody; // <-- add body here as well
}

/**
 * Request that includes typed route params
 */
export interface RequestWithParams<
  TParams extends ParamsDictionary = ParamsDictionary,
> extends ExpressRequest<TParams> {}

/**
 * Request that includes both body and route params
 */
export interface RequestWithBodyAndParams<
  TBody = any,
  TParams extends ParamsDictionary = ParamsDictionary,
> extends ExpressRequest<TParams, any, TBody> {
  body: TBody; // <-- typed body
}

/**
 * Request that includes only headers
 */
export interface RequestWithHeaders<TBody = any> extends ExpressRequest<
  any,
  any,
  TBody
> {
  headers: Record<string, string | string[] | undefined>;
  body: TBody; // <-- typed body
}
