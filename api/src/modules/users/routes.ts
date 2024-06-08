import { errorResponses, responseWithPaginationSchema } from "@/lib/common-responses";
import { createRouteConfig } from "@/lib/route-config";
import { authGuard, publicGuard } from "@/middlewares/guard";
import { getUsersQuerySchema, updateUserRequestSchema, userParamSchema, userSchema } from "./schemas";

/**
 * 自身のユーザー情報を取得するルート設定
 */
export const meRouteConfig = createRouteConfig({
  method: "get",
  path: "/me",
  middleware: [authGuard()],
  security: [
    {
      Bearer: [],
    },
  ],
  tags: ["users"],
  responses: {
    200: {
      description: "User",
      content: {
        "application/json": {
          schema: userSchema,
        },
      },
    },
    ...errorResponses,
  },
});

/**
 * ユーザー一覧を取得するルート設定
 */
export const getUsersConfig = createRouteConfig({
  method: "get",
  path: "/users",
  middleware: [publicGuard],
  tags: ["users"],
  summary: "Get list of users",
  request: {
    query: getUsersQuerySchema,
  },
  responses: {
    200: {
      description: "Users",
      content: {
        "application/json": {
          schema: responseWithPaginationSchema(userSchema),
        },
      },
    },
    ...errorResponses,
  },
});

/**
 * ユーザー情報を更新するルート設定
 */
export const updateUserConfig = createRouteConfig({
  method: "put",
  path: "/users/{id}",
  middleware: [authGuard()],
  security: [{ Bearer: [] }],
  tags: ["users"],
  summary: "Update a user",
  request: {
    params: userParamSchema,
    body: {
      content: {
        "application/json": {
          schema: updateUserRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User",
      content: {
        "application/json": {
          schema: userSchema,
        },
      },
    },
    ...errorResponses,
  },
});

/**
 * ユーザーの詳細情報を取得するルート設定
 */
export const getUserByIdRouteConfig = createRouteConfig({
  method: "get",
  path: "/users/{id}",
  middleware: [publicGuard],
  tags: ["users"],
  request: {
    params: userParamSchema,
  },
  responses: {
    200: {
      description: "User",
      content: {
        "application/json": {
          schema: userSchema,
        },
      },
    },
    ...errorResponses,
  },
});
