import type { Env } from "@/types/common";
import type { Context, Next } from "hono";
import { jwt } from "hono/jwt";

/**
 * 環境変数をミドルウェアで使用するにはこのように書く
 */
export const jwtAuth = () => (c: Context<Env>, next: Next) => jwt({ secret: c.env.JWT_SECRET })(c, next);
