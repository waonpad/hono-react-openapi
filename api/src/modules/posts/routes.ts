import { errorResponses, responseWithPaginationSchema } from "@/lib/common-responses";
import { createRouteConfig } from "@/lib/route-config";
import { AppErrorStatusCode } from "@/lib/status-code";
import { authGuard, publicGuard } from "@/middlewares/guard";
import { createPostRequest, getPostsQuery, postParam, postSchema, updatePostRequest } from "./schemas";
/**
 * 投稿一覧を取得するルート設定
 */
export const getPostsConfig = createRouteConfig({
  method: "get",
  path: "/posts",
  middleware: [publicGuard],
  tags: ["posts"],
  summary: "Get list of posts",
  request: {
    query: getPostsQuery.typedSchema(),
  },
  responses: {
    200: {
      description: "Posts",
      content: {
        "application/json": {
          schema: responseWithPaginationSchema(postSchema),
        },
      },
    },
    ...errorResponses({
      validationErrorResnponseSchemas: {
        [AppErrorStatusCode.BAD_REQUEST]: [getPostsQuery.typedValidationErrorResponseSchema()],
      },
    }),
  },
});

/**
 * 投稿を作成するルート設定
 */
export const createPostConfig = createRouteConfig({
  method: "post",
  path: "/posts",
  middleware: [authGuard()],
  security: [{ Bearer: [] }],
  tags: ["posts"],
  summary: "Create a post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createPostRequest.typedSchema(),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Post",
      content: {
        "application/json": {
          schema: postSchema,
        },
      },
    },
    ...errorResponses({
      validationErrorResnponseSchemas: {
        [AppErrorStatusCode.BAD_REQUEST]: [createPostRequest.typedValidationErrorResponseSchema()],
      },
    }),
  },
});

/**
 * 投稿情報を更新するルート設定
 */
export const updatePostConfig = createRouteConfig({
  method: "put",
  path: "/posts/{id}",
  middleware: [authGuard()],
  security: [{ Bearer: [] }],
  tags: ["posts"],
  summary: "Update a post",
  request: {
    params: postParam.schema,
    body: {
      content: {
        "application/json": {
          schema: updatePostRequest.typedSchema(),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Post",
      content: {
        "application/json": {
          schema: postSchema,
        },
      },
    },
    ...errorResponses({
      validationErrorResnponseSchemas: {
        [AppErrorStatusCode.BAD_REQUEST]: [
          postParam.typedValidationErrorResponseSchema(),
          updatePostRequest.typedValidationErrorResponseSchema(),
        ],
      },
    }),
  },
});

/**
 * 投稿の詳細情報を取得するルート設定
 */
export const getPostByIdRouteConfig = createRouteConfig({
  method: "get",
  path: "/posts/{id}",
  middleware: [publicGuard],
  tags: ["posts"],
  request: {
    params: postParam.schema,
  },
  responses: {
    200: {
      description: "Post",
      content: {
        "application/json": {
          schema: postSchema,
        },
      },
    },
    ...errorResponses({
      validationErrorResnponseSchemas: {
        [AppErrorStatusCode.BAD_REQUEST]: [postParam.typedValidationErrorResponseSchema()],
      },
    }),
  },
});

/**
 * 投稿を削除するルート設定
 */
export const deletePostConfig = createRouteConfig({
  method: "delete",
  path: "/posts/{id}",
  middleware: [authGuard()],
  security: [{ Bearer: [] }],
  tags: ["posts"],
  summary: "Delete a post",
  request: {
    params: postParam.schema,
  },
  responses: {
    204: {
      description: "No content",
    },
    ...errorResponses({
      validationErrorResnponseSchemas: {
        [AppErrorStatusCode.BAD_REQUEST]: [postParam.typedValidationErrorResponseSchema()],
      },
    }),
  },
});
