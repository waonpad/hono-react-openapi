import type { StatusCode } from "hono/utils/http-status";
import { z } from "../lib/ja-zod";

/**
 * クライアントが何を原因にエラーが発生したかを確認するための、リソースの種類
 */
export const resourceTypeSchema = z.enum(["USER", "POST"]);

export const errorTypeSchema = z.enum([
  "bad_request",
  "validation_error",
  "unauthorized",
  "forbidden",
  "not_found",
  "server_error",
]);

/**
 * バリデーションエラーのレスポンスのスキーマ
 */
export const validationErrorResnponseSchema = z
  .object({
    error: z.object({
      message: z.string(),
      type: z.literal("validation_error"),
      status: z.literal(400),
      issues: z.array(
        z.object({
          path: z.array(z.union([z.string(), z.number()])),
          code: z.string(),
          message: z.string(),
        }),
      ),
    }),
  })
  .openapi("ValidationErrorResnponse");

/**
 * エラーオブジェクトのスキーマ
 */
export const errorSchema = z.object({
  message: z.string(),
  type: errorTypeSchema,
  status: z.number(),
  severity: z.string(),
  resourceType: resourceTypeSchema.optional(),
  logId: z.string().optional(),
  path: z.string().optional(),
  method: z.string().optional(),
  timestamp: z.string().optional(),
  usr: z.string().optional(),
  org: z.string().optional(),
});

/**
 * エラーレスポンスのスキーマ
 */
export const errorResponseSchema = z
  .object({
    error: errorSchema,
  })
  .openapi("ErrorResponse");

export const createTypedErrorResponseSchema = (
  status: StatusCode,
  type: typeof errorResponseSchema.shape.error._type.type,
  schemaName: string,
) => {
  return errorResponseSchema.merge(
    z
      .object({
        error: z.object({
          status: z.literal(status),
          type: z.literal(type),
        }),
      })
      .openapi(schemaName),
  );
};

/**
 * ページネーションのあるエンドポイントのクエリパラメータのスキーマ
 */
export const paginationQuerySchema = z.object({
  q: z.string().optional().openapi({ description: "検索クエリ" }),
  sort: z.enum(["createdAt"]).default("createdAt").optional().openapi({
    description: "ソートするフィールド",
  }),
  order: z.enum(["asc", "desc"]).default("asc").optional().openapi({
    description: "ソート順",
  }),
  offset: z.coerce.number().default(0).openapi({
    description: "取得するアイテムのオフセット",
  }),
  limit: z.coerce.number().default(50).openapi({
    description: "取得するアイテムの数",
  }),
});

export const timestampSchema = z.object({
  createdAt: z.string().openapi({
    example: "2024-05-22 13:51:19",
  }),
  updatedAt: z.string().openapi({
    example: "2024-05-22 13:51:19",
  }),
});
