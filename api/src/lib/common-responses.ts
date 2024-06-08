import type { createRoute } from "@hono/zod-openapi";
import { z } from "../lib/ja-zod";
import { createTypedErrorResponseSchema, validationErrorResnponseSchema } from "./common-schemas";
import { AppErrorStatusCode } from "./status-code";

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
  [AppErrorStatusCode.BAD_REQUEST]: {
    description: "Bad request: problem processing request.",
    content: {
      "application/json": {
        schema: z.union([
          createTypedErrorResponseSchema("BAD_REQUEST", "BadRequestErrorResponse"),
          validationErrorResnponseSchema,
        ]),
      },
    },
  },
  [AppErrorStatusCode.UNAUTHORIZED]: {
    description: "Unauthorized: authentication required.",
    content: {
      "application/json": {
        schema: createTypedErrorResponseSchema("UNAUTHORIZED", "UnauthorizedErrorResponse"),
      },
    },
  },
  [AppErrorStatusCode.FORBIDDEN]: {
    description: "Forbidden: insufficient permissions.",
    content: {
      "application/json": {
        schema: createTypedErrorResponseSchema("FORBIDDEN", "ForbiddenErrorResponse"),
      },
    },
  },
  [AppErrorStatusCode.NOT_FOUND]: {
    description: "Not found: resource does not exist.",
    content: {
      "application/json": {
        schema: createTypedErrorResponseSchema("NOT_FOUND", "NotFoundErrorResponse"),
      },
    },
  },
  [AppErrorStatusCode.SERVER_ERROR]: {
    description: "Server error: something went wrong.",
    content: {
      "application/json": {
        schema: createTypedErrorResponseSchema("SERVER_ERROR", "ServerErrorResponse"),
      },
    },
  },
} satisfies Responses;
