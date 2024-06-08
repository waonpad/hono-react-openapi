import { paginationQuerySchema, timestampSchema } from "@/lib/common-schemas";
import { z } from "@hono/zod-openapi";
import { userSchema } from "../users/schemas";

/**
 * 投稿のスキーマ
 */
export const postSchema = z
  .object({
    id: z.string().openapi({
      example: "hOn012drizZle34aP1",
    }),
    title: z.string().min(1).max(100).openapi({
      example: "HonoDrizzle",
    }),
    body: z.string().min(1).openapi({
      example: "Post body",
    }),
    public: z.boolean().openapi({
      example: true,
    }),
    authorId: userSchema.shape.id,
  })
  .merge(timestampSchema)
  .openapi("Post");

/**
 * 投稿一覧のクエリパラメータのスキーマ
 */
export const getPostsQuerySchema = paginationQuerySchema
  .merge(
    z.object({
      sort: z
        .enum(["id", "createdAt", "updatedAt"] as const satisfies (keyof typeof postSchema._type)[])
        .default("createdAt")
        .optional()
        .openapi({
          example: "createdAt",
        }),
    }),
  )
  .openapi("GetPostsQuery");

/**
 * 投稿の作成リクエストボディのスキーマ
 */
export const createPostRequestSchema = postSchema
  .pick({
    title: true,
    body: true,
    public: true,
  })
  .openapi("CreatePostRequest");

/**
 * 投稿の更新リクエストボディのスキーマ
 */
export const updatePostRequestSchema = postSchema
  .pick({
    title: true,
    body: true,
    public: true,
  })
  .openapi("UpdatePostRequest");

/**
 * 投稿に関連するパスパラメータのスキーマ
 */
export const postParamSchema = z
  .object({
    id: postSchema.shape.id,
  })
  .openapi("PostParam");
