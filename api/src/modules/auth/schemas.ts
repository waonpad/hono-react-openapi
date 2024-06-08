import { z } from "@/lib/ja-zod";
import { userPasswordSchema, userSchema } from "../users/schemas";

/**
 * サインインのリクエストボディのスキーマ
 */
export const signInRequestSchema = z
  .object({
    email: userSchema.shape.email,
    password: userPasswordSchema,
  })
  .openapi("SignInRequest");

/**
 * サインアップのリクエストボディのスキーマ
 */
export const signUpRequestSchema = z
  .object({
    name: userSchema.shape.name,
    email: userSchema.shape.email,
    password: userPasswordSchema,
  })
  .openapi("SignUpRequest");

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
