import {
  createTypedValidationErrorResponseSchema,
  createValidationSchemaWithTarget,
} from "@/lib/typed-validation-error";
import { getKeys } from "@/lib/utils";
import { z } from "@hono/zod-openapi";
import { userPasswordSchema, userSchema } from "../users/schemas";

/**
 * サインインのリクエストボディのスキーマ
 */
export const signInRequest = {
  schema: z.object({
    email: userSchema.shape.email,
    password: userPasswordSchema,
  }),
  typedSchema: () =>
    createValidationSchemaWithTarget({
      target: "json",
      schema: signInRequest.schema,
    }).openapi("SignInRequest"),
  typedValidationErrorResponseSchema: () =>
    createTypedValidationErrorResponseSchema({
      target: "json",
      keys: getKeys(signInRequest.schema.shape),
    }).openapi("SignInValidationErrorResponse"),
};

/**
 * サインアップのリクエストボディのスキーマ
 */
export const signUpRequest = {
  schema: z.object({
    name: userSchema.shape.name,
    email: userSchema.shape.email,
    password: userPasswordSchema,
  }),
  typedSchema: () =>
    createValidationSchemaWithTarget({
      target: "json",
      schema: signUpRequest.schema,
    }).openapi("SignUpRequest"),
  typedValidationErrorResponseSchema: () =>
    createTypedValidationErrorResponseSchema({
      target: "json",
      keys: getKeys(signUpRequest.schema.shape),
    }).openapi("SignUpValidationErrorResponse"),
};

/**
 * サインアップのレスポンスのスキーマ
 */
export const signUpResponseSchema = z
  .object({
    user: userSchema,
    token: z.string().openapi({
      example: "1234567890",
    }),
  })
  .openapi("SignUpResponse");

/**
 * サインアップのレスポンスのスキーマ
 */
export const signInResponseSchema = z
  .object({
    user: userSchema,
    token: z.string().openapi({
      example: "1234567890",
    }),
  })
  .openapi("SignInResponse");

/**
 * JWTのペイロードのスキーマ
 */
export const jwtPayloadSchema = z
  .object({
    sub: userSchema.shape.id,
    exp: z.number().openapi({
      example: 1234567890,
    }),
  })
  .openapi("JwtPayload");
