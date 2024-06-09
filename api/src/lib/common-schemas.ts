import { constructZodLiteralUnionType } from "@/lib/zod";
import { z } from "@hono/zod-openapi";
import { severitySchema } from "./errors";
import { AppErrorStatusCode, ErrorType, formatToHttpStatusCode } from "./status-code";

/**
 * クライアントが何を原因にエラーが発生したかを確認するための、リソースの種類
 */
export const resourceTypeSchema = z.enum(["USER", "POST"]);

export const errorTypeSchema = z.enum(ErrorType);

/**
 * エラーオブジェクトのスキーマ
 */
export const errorSchema = z.object({
  message: z.string(),
  type: errorTypeSchema,
  /**
   * アプリ内で明示的に使用しているHttpエラーのステータスコードだけを許容する
   */
  status: constructZodLiteralUnionType(Object.values(AppErrorStatusCode).map((v) => formatToHttpStatusCode(v))),
  severity: severitySchema,
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
export const errorResponseSchema = z.object({
  error: errorSchema,
});

export const createTypedErrorResponseSchema = (type: typeof errorResponseSchema.shape.error._type.type) => {
  return errorResponseSchema.merge(
    z.object({
      error: errorResponseSchema.shape.error.merge(
        z.object({
          status: z.literal(formatToHttpStatusCode(AppErrorStatusCode[type])),
          type: z.literal(type),
        }),
      ),
    }),
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
