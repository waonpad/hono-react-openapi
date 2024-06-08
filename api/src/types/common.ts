import type { errorResponseSchema, resourceTypeSchema } from "@/lib/common-schemas";
import type { z } from "@/lib/ja-zod";
import type { jwtPayloadSchema } from "@/modules/auth/schemas";
import type { D1Database } from "@cloudflare/workers-types";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Schema } from "hono";

export type PageResourceType = z.infer<typeof resourceTypeSchema>;

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

/**
 * honoの型を現在上書きできないので、ここで定義して随時アサーションする
 */
export type JwtPayload = typeof jwtPayloadSchema._type;

export type Env = {
  /**
   * コンテキストで使う変数の型定義
   */
  Variables: {
    jwtPayload: JwtPayload;
  };
  /**
   * 環境変数の型定義
   */
  Bindings: {
    JWT_SECRET: string;
    DB: D1Database;
  };
};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export class CustomHono<E extends Env = Env, S extends Schema = {}, BasePath extends string = "/"> extends OpenAPIHono<
  E,
  S,
  BasePath
> {}
