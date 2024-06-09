import { paginationQuerySchema, timestampSchema } from "@/lib/common-schemas";
import { z } from "@/lib/ja-zod";
import {
  createTypedValidationErrorResponseSchema,
  createValidationSchemaWithTarget,
} from "@/lib/typed-validation-error";
import { getKeys } from "@/lib/utils";
import { roleEnum } from "@/schemas/users";

/**
 * ユーザーのスキーマ
 */
export const userSchema = z
  .object({
    id: z.string().openapi({
      example: "hOn012drizZle34aP1",
    }),
    name: z.string().min(2).max(100).openapi({
      example: "John Doe",
    }),
    email: z.string().email().openapi({
      example: "example@exmaple.com",
    }),
    role: z.enum(roleEnum).openapi({
      example: "USER",
    }),
  })
  .merge(timestampSchema)
  .openapi("User");

/**
 * ユーザー一覧のクエリパラメータのスキーマ
 */
export const getUsersQuery = {
  schema: paginationQuerySchema
    .merge(
      z.object({
        sort: z
          .enum([
            "id",
            "name",
            "email",
            "role",
            "createdAt",
            "updatedAt",
          ] as const satisfies (keyof typeof userSchema._type)[])
          .default("createdAt")
          .optional()
          .openapi({
            example: "createdAt",
          }),
        role: z.enum(roleEnum).default("USER").optional().openapi({
          example: "ADMIN",
        }),
      }),
    )
    .openapi("GetUsersQuery"),
  typedSchema: () =>
    createValidationSchemaWithTarget({
      target: "query",
      schema: getUsersQuery.schema,
    }).openapi("GetUsersQuery"),
  typedValidationErrorResponseSchema: () =>
    createTypedValidationErrorResponseSchema({
      schema: getUsersQuery.typedSchema(),
      paramsForThrowError: {
        sort: "invalid",
      },
      appendKeys: getKeys(getUsersQuery.schema.shape),
    }).openapi("GetUsersQueryValidationErrorResponse"),
};

/**
 * ユーザーの更新リクエストボディのスキーマ
 */
export const updateUserRequest = {
  schema: userSchema.pick({
    name: true,
    email: true,
    role: true,
  }),
  typedSchema: () =>
    createValidationSchemaWithTarget({
      target: "json",
      schema: updateUserRequest.schema,
    }).openapi("UpdateUserRequest"),
  typedValidationErrorResponseSchema: () =>
    createTypedValidationErrorResponseSchema({
      schema: updateUserRequest.typedSchema(),
      appendKeys: getKeys(updateUserRequest.schema.shape),
    }).openapi("UpdateUserValidationErrorResponse"),
};

/**
 * ユーザーに関連するパスパラメータのスキーマ
 */
export const userParam = {
  schema: z
    .object({
      id: userSchema.shape.id,
    })
    .openapi("UserParam"),
  typedValidationErrorResponseSchema: () =>
    createTypedValidationErrorResponseSchema({
      schema: userParam.schema,
      appendKeys: getKeys(userParam.schema.shape),
      isParam: true,
    }).openapi("UserParamValidationErrorResponse"),
};

export const userPasswordSchema = z
  .string()
  .min(8)
  .max(100)
  .openapi({
    example: "password123",
  })
  .openapi("UserPassword");
