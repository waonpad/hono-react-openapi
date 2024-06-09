import { paginationQuerySchema, timestampSchema } from "@/lib/common-schemas";
import {
  createTypedValidationErrorResponseSchema,
  createValidationSchemaWithTarget,
} from "@/lib/typed-validation-error";
import { getKeys } from "@/lib/utils";
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
export const getPostsQuery = {
  schema: paginationQuerySchema.merge(
    z.object({
      sort: z
        .enum(["id", "createdAt", "updatedAt"] as const satisfies (keyof typeof postSchema._type)[])
        .default("createdAt")
        .optional()
        .openapi({
          example: "createdAt",
        }),
    }),
  ),
  typedSchema: () =>
    createValidationSchemaWithTarget({
      target: "query",
      schema: getPostsQuery.schema,
    }).openapi("GetPostsQuery"),
  typedValidationErrorResponseSchema: () =>
    createTypedValidationErrorResponseSchema({
      target: "query",
      keys: getKeys(getPostsQuery.schema.shape),
    }).openapi("GetPostsQueryValidationErrorResponse"),
};

/**
 * 投稿の作成リクエストボディのスキーマ
 */
export const createPostRequest = {
  schema: postSchema.pick({
    title: true,
    body: true,
    public: true,
  }),
  typedSchema: () =>
    createValidationSchemaWithTarget({
      target: "json",
      schema: createPostRequest.schema,
    }).openapi("CreatePostRequest"),
  typedValidationErrorResponseSchema: () =>
    createTypedValidationErrorResponseSchema({
      target: "json",
      keys: getKeys(createPostRequest.schema.shape),
    }).openapi("CreatePostValidationErrorResponse"),
};

/**
 * 投稿の更新リクエストボディのスキーマ
 */
export const updatePostRequest = {
  schema: postSchema.pick({
    title: true,
    body: true,
    public: true,
  }),
  typedSchema: () =>
    createValidationSchemaWithTarget({
      target: "json",
      schema: updatePostRequest.schema,
    }).openapi("UpdatePostRequest"),
  typedValidationErrorResponseSchema: () =>
    createTypedValidationErrorResponseSchema({
      target: "json",
      keys: getKeys(updatePostRequest.schema.shape),
    }).openapi("UpdatePostValidationErrorResponse"),
};

/**
 * 投稿に関連するパスパラメータのスキーマ
 */
export const postParam = {
  schema: z
    .object({
      id: postSchema.shape.id,
    })
    .openapi("PostParam"),
  typedValidationErrorResponseSchema: () =>
    createTypedValidationErrorResponseSchema({
      target: "param",
      keys: getKeys(postParam.schema.shape),
    }).openapi("PostParamValidationErrorResponse"),
};
