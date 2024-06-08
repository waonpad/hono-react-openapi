import type { createRoute } from "@hono/zod-openapi";
import { z } from "../lib/ja-zod";
import { createTypedErrorResponseSchema } from "./common-schemas";

type Responses = Parameters<typeof createRoute>[0]["responses"];

/**
 * ページネーション情報を含むレスポンスのスキーマ
 */
export const responseWithPaginationSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    data: z.object({
      items: schema.array().openapi({
        description: "アイテムの配列",
      }),
      total: z.number().openapi({
        description: "アイテムの総数",
        example: 1,
      }),
    }),
  });

/**
 * エラーレスポンスのOpen API用の定義
 */
export const errorResponses = {
  // 型の絞り込みをするため、typeをリテラルで指定している
  400: {
    description: "Bad request: problem processing request.",
    content: {
      "application/json": {
        schema: createTypedErrorResponseSchema(400, "bad_request", "BadRequestErrorResponse"),
      },
    },
  },
  401: {
    description: "Unauthorized: authentication required.",
    content: {
      "application/json": {
        schema: createTypedErrorResponseSchema(401, "unauthorized", "UnauthorizedErrorResponse"),
      },
    },
  },
  403: {
    description: "Forbidden: insufficient permissions.",
    content: {
      "application/json": {
        schema: createTypedErrorResponseSchema(403, "forbidden", "ForbiddenErrorResponse"),
      },
    },
  },
  404: {
    description: "Not found: resource does not exist.",
    content: {
      "application/json": {
        schema: createTypedErrorResponseSchema(404, "not_found", "NotFoundErrorResponse"),
      },
    },
  },
  500: {
    description: "Server error: something went wrong.",
    content: {
      "application/json": {
        schema: createTypedErrorResponseSchema(500, "server_error", "ServerErrorResponse"),
      },
    },
  },
} satisfies Responses;
