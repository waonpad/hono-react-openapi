import { errorResponses } from "@/lib/common-responses";
import { createRouteConfig } from "@/lib/route-config";
import { publicGuard } from "@/middlewares/guard";
import { signInRequestSchema, signInResponseSchema, signUpRequestSchema, signUpResponseSchema } from "./schemas";

/**
 * サインアップのルート設定
 */
export const signUpRouteConfig = createRouteConfig({
  method: "post",
  path: "/sign-up",
  tags: ["auth"],
  summary: "Sign up a new user",
  middleware: [publicGuard],
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: signUpRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User signed up successfully (cookie set automatically)",
      content: {
        "application/json": {
          schema: signUpResponseSchema,
        },
      },
    },
    ...errorResponses,
  },
});

/**
 * サインインのルート設定
 */
export const signInRouteConfig = createRouteConfig({
  method: "post",
  path: "/sign-in",
  tags: ["auth"],
  summary: "Sign in a user",
  middleware: [publicGuard],
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: signInRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User signed in successfully (cookie set automatically)",
      content: {
        "application/json": {
          schema: signInResponseSchema,
        },
      },
    },
    ...errorResponses,
  },
});
