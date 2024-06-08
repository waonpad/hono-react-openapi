import type { MiddlewareHandler } from "hono";
import { jwtAuth } from "./auth";

/**
 * 標準のjwt認証をそのまま利用する認証ガード
 */
export const authGuard = (): MiddlewareHandler => jwtAuth();

/**
 * パブリックなAPIであることを示すためのガード
 */
export const publicGuard: MiddlewareHandler = async (_, next) => {
  await next();
};
