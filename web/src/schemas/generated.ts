// import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "@/lib/zod/i18n/ja";

export const UserPassword = z.string();
export const SignUpRequest = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: UserPassword.min(8).max(100),
});
export const User = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const SignUpResponse = z.object({ user: User, token: z.string() });
export const ValidationErrorResnponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("VALIDATION_ERROR"),
    status: z.literal(400),
    issues: z.array(
      z.object({
        path: z.array(z.union([z.string(), z.number()])),
        code: z.string(),
        message: z.string(),
      })
    ),
  }),
});
export const SignInRequest = z.object({
  email: z.string().email(),
  password: UserPassword.min(8).max(100),
});
export const SignInResponse = z.object({ user: User, token: z.string() });
export const UpdateUserRequest = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]),
});
export const offset = z.union([z.number(), z.null()]).optional().default(0);
export const limit = z.union([z.number(), z.null()]).optional().default(50);
export const CreatePostRequest = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1),
  public: z.boolean(),
});
export const Post = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  body: z.string().min(1),
  public: z.boolean(),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const UpdatePostRequest = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1),
  public: z.boolean(),
});

export const schemas = {
  UserPassword,
  SignUpRequest,
  User,
  SignUpResponse,
  ValidationErrorResnponse,
  SignInRequest,
  SignInResponse,
  UpdateUserRequest,
  offset,
  limit,
  CreatePostRequest,
  Post,
  UpdatePostRequest,
};

// const endpoints = makeApi([
export const endpoints = {
  getMe: {
    method: "get",
    path: "/me",
    alias: "getMe",
    requestFormat: "json",
    parameters: {
      body: {},
      query: {
        schema: z.object({}),
        __: "",
      },
      path: {
        schema: z.object({}),
        __: "",
      },
    },
    response: User,
    errors: [
      {
        status: 400,
        description: `Bad request: problem processing request.`,
        schema: z.union([
          z.object({
            error: z.object({
              status: z.literal(400),
              type: z.literal("BAD_REQUEST"),
            }),
          }),
          ValidationErrorResnponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: z.object({
          error: z.object({
            status: z.literal(401),
            type: z.literal("UNAUTHORIZED"),
          }),
        }),
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: z.object({
          error: z.object({
            status: z.literal(403),
            type: z.literal("FORBIDDEN"),
          }),
        }),
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: z.object({
          error: z.object({
            status: z.literal(404),
            type: z.literal("NOT_FOUND"),
          }),
        }),
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: z.object({
          error: z.object({
            status: z.literal(500),
            type: z.literal("SERVER_ERROR"),
          }),
        }),
      },
    ],
  },
  postPosts: {
    method: "post",
    path: "/posts",
    alias: "postPosts",
    requestFormat: "json",
    parameters: {
      body: {
        schema: CreatePostRequest,
      },
      query: {
        schema: z.object({}),
        __: "",
      },
      path: {
        schema: z.object({}),
        __: "",
      },
    },
    response: Post,
    errors: [
      {
        status: 400,
        description: `Bad request: problem processing request.`,
        schema: z.union([
          z.object({
            error: z.object({
              status: z.literal(400),
              type: z.literal("BAD_REQUEST"),
            }),
          }),
          ValidationErrorResnponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: z.object({
          error: z.object({
            status: z.literal(401),
            type: z.literal("UNAUTHORIZED"),
          }),
        }),
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: z.object({
          error: z.object({
            status: z.literal(403),
            type: z.literal("FORBIDDEN"),
          }),
        }),
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: z.object({
          error: z.object({
            status: z.literal(404),
            type: z.literal("NOT_FOUND"),
          }),
        }),
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: z.object({
          error: z.object({
            status: z.literal(500),
            type: z.literal("SERVER_ERROR"),
          }),
        }),
      },
    ],
  },
  getPosts: {
    method: "get",
    path: "/posts",
    alias: "getPosts",
    requestFormat: "json",
    parameters: {
      body: {},
      query: {
        schema: z.object({
          q: z.string().optional(),
          sort: z
            .enum(["id", "createdAt", "updatedAt"])
            .optional()
            .default("createdAt"),
          order: z.enum(["asc", "desc"]).optional().default("asc"),
          offset: offset,
          limit: limit,
        }),
        __: "_____",
      },
      path: {
        schema: z.object({}),
        __: "",
      },
    },
    response: z.object({
      data: z.object({ items: z.array(Post), total: z.number() }),
    }),
    errors: [
      {
        status: 400,
        description: `Bad request: problem processing request.`,
        schema: z.union([
          z.object({
            error: z.object({
              status: z.literal(400),
              type: z.literal("BAD_REQUEST"),
            }),
          }),
          ValidationErrorResnponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: z.object({
          error: z.object({
            status: z.literal(401),
            type: z.literal("UNAUTHORIZED"),
          }),
        }),
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: z.object({
          error: z.object({
            status: z.literal(403),
            type: z.literal("FORBIDDEN"),
          }),
        }),
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: z.object({
          error: z.object({
            status: z.literal(404),
            type: z.literal("NOT_FOUND"),
          }),
        }),
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: z.object({
          error: z.object({
            status: z.literal(500),
            type: z.literal("SERVER_ERROR"),
          }),
        }),
      },
    ],
  },
  putPostsId: {
    method: "put",
    path: "/posts/:id",
    alias: "putPostsId",
    requestFormat: "json",
    parameters: {
      body: {
        schema: UpdatePostRequest,
      },
      query: {
        schema: z.object({}),
        __: "",
      },
      path: {
        schema: z.object({
          id: z.string(),
        }),
        __: "_",
      },
    },
    response: Post,
    errors: [
      {
        status: 400,
        description: `Bad request: problem processing request.`,
        schema: z.union([
          z.object({
            error: z.object({
              status: z.literal(400),
              type: z.literal("BAD_REQUEST"),
            }),
          }),
          ValidationErrorResnponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: z.object({
          error: z.object({
            status: z.literal(401),
            type: z.literal("UNAUTHORIZED"),
          }),
        }),
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: z.object({
          error: z.object({
            status: z.literal(403),
            type: z.literal("FORBIDDEN"),
          }),
        }),
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: z.object({
          error: z.object({
            status: z.literal(404),
            type: z.literal("NOT_FOUND"),
          }),
        }),
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: z.object({
          error: z.object({
            status: z.literal(500),
            type: z.literal("SERVER_ERROR"),
          }),
        }),
      },
    ],
  },
  getPostsId: {
    method: "get",
    path: "/posts/:id",
    alias: "getPostsId",
    requestFormat: "json",
    parameters: {
      body: {},
      query: {
        schema: z.object({}),
        __: "",
      },
      path: {
        schema: z.object({
          id: z.string(),
        }),
        __: "_",
      },
    },
    response: Post,
    errors: [
      {
        status: 400,
        description: `Bad request: problem processing request.`,
        schema: z.union([
          z.object({
            error: z.object({
              status: z.literal(400),
              type: z.literal("BAD_REQUEST"),
            }),
          }),
          ValidationErrorResnponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: z.object({
          error: z.object({
            status: z.literal(401),
            type: z.literal("UNAUTHORIZED"),
          }),
        }),
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: z.object({
          error: z.object({
            status: z.literal(403),
            type: z.literal("FORBIDDEN"),
          }),
        }),
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: z.object({
          error: z.object({
            status: z.literal(404),
            type: z.literal("NOT_FOUND"),
          }),
        }),
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: z.object({
          error: z.object({
            status: z.literal(500),
            type: z.literal("SERVER_ERROR"),
          }),
        }),
      },
    ],
  },
  deletePostsId: {
    method: "delete",
    path: "/posts/:id",
    alias: "deletePostsId",
    requestFormat: "json",
    parameters: {
      body: {},
      query: {
        schema: z.object({}),
        __: "",
      },
      path: {
        schema: z.object({
          id: z.string(),
        }),
        __: "_",
      },
    },
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request: problem processing request.`,
        schema: z.union([
          z.object({
            error: z.object({
              status: z.literal(400),
              type: z.literal("BAD_REQUEST"),
            }),
          }),
          ValidationErrorResnponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: z.object({
          error: z.object({
            status: z.literal(401),
            type: z.literal("UNAUTHORIZED"),
          }),
        }),
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: z.object({
          error: z.object({
            status: z.literal(403),
            type: z.literal("FORBIDDEN"),
          }),
        }),
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: z.object({
          error: z.object({
            status: z.literal(404),
            type: z.literal("NOT_FOUND"),
          }),
        }),
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: z.object({
          error: z.object({
            status: z.literal(500),
            type: z.literal("SERVER_ERROR"),
          }),
        }),
      },
    ],
  },
  postSignIn: {
    method: "post",
    path: "/sign-in",
    alias: "postSignIn",
    requestFormat: "json",
    parameters: {
      body: {
        schema: SignInRequest,
      },
      query: {
        schema: z.object({}),
        __: "",
      },
      path: {
        schema: z.object({}),
        __: "",
      },
    },
    response: SignInResponse,
    errors: [
      {
        status: 400,
        description: `Bad request: problem processing request.`,
        schema: z.union([
          z.object({
            error: z.object({
              status: z.literal(400),
              type: z.literal("BAD_REQUEST"),
            }),
          }),
          ValidationErrorResnponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: z.object({
          error: z.object({
            status: z.literal(401),
            type: z.literal("UNAUTHORIZED"),
          }),
        }),
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: z.object({
          error: z.object({
            status: z.literal(403),
            type: z.literal("FORBIDDEN"),
          }),
        }),
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: z.object({
          error: z.object({
            status: z.literal(404),
            type: z.literal("NOT_FOUND"),
          }),
        }),
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: z.object({
          error: z.object({
            status: z.literal(500),
            type: z.literal("SERVER_ERROR"),
          }),
        }),
      },
    ],
  },
  postSignUp: {
    method: "post",
    path: "/sign-up",
    alias: "postSignUp",
    requestFormat: "json",
    parameters: {
      body: {
        schema: SignUpRequest,
      },
      query: {
        schema: z.object({}),
        __: "",
      },
      path: {
        schema: z.object({}),
        __: "",
      },
    },
    response: SignUpResponse,
    errors: [
      {
        status: 400,
        description: `Bad request: problem processing request.`,
        schema: z.union([
          z.object({
            error: z.object({
              status: z.literal(400),
              type: z.literal("BAD_REQUEST"),
            }),
          }),
          ValidationErrorResnponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: z.object({
          error: z.object({
            status: z.literal(401),
            type: z.literal("UNAUTHORIZED"),
          }),
        }),
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: z.object({
          error: z.object({
            status: z.literal(403),
            type: z.literal("FORBIDDEN"),
          }),
        }),
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: z.object({
          error: z.object({
            status: z.literal(404),
            type: z.literal("NOT_FOUND"),
          }),
        }),
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: z.object({
          error: z.object({
            status: z.literal(500),
            type: z.literal("SERVER_ERROR"),
          }),
        }),
      },
    ],
  },
  getUsers: {
    method: "get",
    path: "/users",
    alias: "getUsers",
    requestFormat: "json",
    parameters: {
      body: {},
      query: {
        schema: z.object({
          q: z.string().optional(),
          sort: z
            .enum(["id", "name", "email", "role", "createdAt", "updatedAt"])
            .optional()
            .default("createdAt"),
          order: z.enum(["asc", "desc"]).optional().default("asc"),
          offset: offset,
          limit: limit,
          role: z.enum(["ADMIN", "USER"]).optional().default("USER"),
        }),
        __: "______",
      },
      path: {
        schema: z.object({}),
        __: "",
      },
    },
    response: z.object({
      data: z.object({ items: z.array(User), total: z.number() }),
    }),
    errors: [
      {
        status: 400,
        description: `Bad request: problem processing request.`,
        schema: z.union([
          z.object({
            error: z.object({
              status: z.literal(400),
              type: z.literal("BAD_REQUEST"),
            }),
          }),
          ValidationErrorResnponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: z.object({
          error: z.object({
            status: z.literal(401),
            type: z.literal("UNAUTHORIZED"),
          }),
        }),
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: z.object({
          error: z.object({
            status: z.literal(403),
            type: z.literal("FORBIDDEN"),
          }),
        }),
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: z.object({
          error: z.object({
            status: z.literal(404),
            type: z.literal("NOT_FOUND"),
          }),
        }),
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: z.object({
          error: z.object({
            status: z.literal(500),
            type: z.literal("SERVER_ERROR"),
          }),
        }),
      },
    ],
  },
  putUsersId: {
    method: "put",
    path: "/users/:id",
    alias: "putUsersId",
    requestFormat: "json",
    parameters: {
      body: {
        schema: UpdateUserRequest,
      },
      query: {
        schema: z.object({}),
        __: "",
      },
      path: {
        schema: z.object({
          id: z.string(),
        }),
        __: "_",
      },
    },
    response: User,
    errors: [
      {
        status: 400,
        description: `Bad request: problem processing request.`,
        schema: z.union([
          z.object({
            error: z.object({
              status: z.literal(400),
              type: z.literal("BAD_REQUEST"),
            }),
          }),
          ValidationErrorResnponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: z.object({
          error: z.object({
            status: z.literal(401),
            type: z.literal("UNAUTHORIZED"),
          }),
        }),
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: z.object({
          error: z.object({
            status: z.literal(403),
            type: z.literal("FORBIDDEN"),
          }),
        }),
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: z.object({
          error: z.object({
            status: z.literal(404),
            type: z.literal("NOT_FOUND"),
          }),
        }),
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: z.object({
          error: z.object({
            status: z.literal(500),
            type: z.literal("SERVER_ERROR"),
          }),
        }),
      },
    ],
  },
  getUsersId: {
    method: "get",
    path: "/users/:id",
    alias: "getUsersId",
    requestFormat: "json",
    parameters: {
      body: {},
      query: {
        schema: z.object({}),
        __: "",
      },
      path: {
        schema: z.object({
          id: z.string(),
        }),
        __: "_",
      },
    },
    response: User,
    errors: [
      {
        status: 400,
        description: `Bad request: problem processing request.`,
        schema: z.union([
          z.object({
            error: z.object({
              status: z.literal(400),
              type: z.literal("BAD_REQUEST"),
            }),
          }),
          ValidationErrorResnponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: z.object({
          error: z.object({
            status: z.literal(401),
            type: z.literal("UNAUTHORIZED"),
          }),
        }),
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: z.object({
          error: z.object({
            status: z.literal(403),
            type: z.literal("FORBIDDEN"),
          }),
        }),
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: z.object({
          error: z.object({
            status: z.literal(404),
            type: z.literal("NOT_FOUND"),
          }),
        }),
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: z.object({
          error: z.object({
            status: z.literal(500),
            type: z.literal("SERVER_ERROR"),
          }),
        }),
      },
    ],
  },
  // ]) as const;
} as const;

// export const api = new Zodios(endpoints);

// export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
//     return new Zodios(baseUrl, endpoints, options);
// }
