import { errorResponses, responseWithPaginationSchema } from "@/lib/common-responses";
import { createRouteConfig } from "@/lib/route-config";
import { AppErrorStatusCode } from "@/lib/status-code";
import { authGuard, publicGuard } from "@/middlewares/guard";
import { getUsersQuery, updateUserRequest, userParam, userSchema } from "./schemas";

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
    ...errorResponses({}),
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
    query: getUsersQuery.typedSchema(),
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
    ...errorResponses({
      validationErrorResnponseSchemas: {
        [AppErrorStatusCode.BAD_REQUEST]: [getUsersQuery.typedValidationErrorResponseSchema()],
      },
    }),
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
    params: userParam.schema,
    body: {
      content: {
        "application/json": {
          schema: updateUserRequest.typedSchema(),
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
    ...errorResponses({
      validationErrorResnponseSchemas: {
        [AppErrorStatusCode.BAD_REQUEST]: [
          userParam.typedValidationErrorResponseSchema(),
          updateUserRequest.typedValidationErrorResponseSchema(),
        ],
      },
    }),
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
    params: userParam.schema,
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
    ...errorResponses({
      validationErrorResnponseSchemas: {
        [AppErrorStatusCode.BAD_REQUEST]: [userParam.typedValidationErrorResponseSchema()],
      },
    }),
  },
});
