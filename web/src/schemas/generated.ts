// import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "@/lib/zod/i18n/ja";

export const UserPassword = z.string();
export const SignUpRequest = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: UserPassword.min(8).max(100),
  __target: z.literal("json").optional(),
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
export const BadRequestErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("BAD_REQUEST"),
    status: z.literal(400),
    severity: z.string(),
    resourceType: z.enum(["USER", "POST"]).optional(),
    logId: z.string().optional(),
    path: z.string().optional(),
    method: z.string().optional(),
    timestamp: z.string().optional(),
    usr: z.string().optional(),
    org: z.string().optional(),
  }),
});
export const SignUpValidationErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("VALIDATION_ERROR"),
    status: z.literal(400),
    validationTarget: z.literal("json"),
    formErrors: z.string(),
    fieldErrors: z
      .object({ name: z.string(), email: z.string(), password: z.string() })
      .partial(),
  }),
});
export const UnauthorizedErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("UNAUTHORIZED"),
    status: z.literal(401),
    severity: z.string(),
    resourceType: z.enum(["USER", "POST"]).optional(),
    logId: z.string().optional(),
    path: z.string().optional(),
    method: z.string().optional(),
    timestamp: z.string().optional(),
    usr: z.string().optional(),
    org: z.string().optional(),
  }),
});
export const ForbiddenErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("FORBIDDEN"),
    status: z.literal(403),
    severity: z.string(),
    resourceType: z.enum(["USER", "POST"]).optional(),
    logId: z.string().optional(),
    path: z.string().optional(),
    method: z.string().optional(),
    timestamp: z.string().optional(),
    usr: z.string().optional(),
    org: z.string().optional(),
  }),
});
export const NotFoundErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("NOT_FOUND"),
    status: z.literal(404),
    severity: z.string(),
    resourceType: z.enum(["USER", "POST"]).optional(),
    logId: z.string().optional(),
    path: z.string().optional(),
    method: z.string().optional(),
    timestamp: z.string().optional(),
    usr: z.string().optional(),
    org: z.string().optional(),
  }),
});
export const ServerErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("SERVER_ERROR"),
    status: z.literal(500),
    severity: z.string(),
    resourceType: z.enum(["USER", "POST"]).optional(),
    logId: z.string().optional(),
    path: z.string().optional(),
    method: z.string().optional(),
    timestamp: z.string().optional(),
    usr: z.string().optional(),
    org: z.string().optional(),
  }),
});
export const SignInRequest = z.object({
  email: z.string().email(),
  password: UserPassword.min(8).max(100),
  __target: z.literal("json").optional(),
});
export const SignInResponse = z.object({ user: User, token: z.string() });
export const SignInValidationErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("VALIDATION_ERROR"),
    status: z.literal(400),
    validationTarget: z.literal("json"),
    formErrors: z.string(),
    fieldErrors: z
      .object({ email: z.string(), password: z.string() })
      .partial(),
  }),
});
export const UpdateUserRequest = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]),
  __target: z.literal("json").optional(),
});
export const UserParamValidationErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("VALIDATION_ERROR"),
    status: z.literal(400),
    validationTarget: z.literal("param"),
    formErrors: z.string(),
    fieldErrors: z.object({ id: z.string() }).partial(),
  }),
});
export const UpdateUserValidationErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("VALIDATION_ERROR"),
    status: z.literal(400),
    validationTarget: z.literal("json"),
    formErrors: z.string(),
    fieldErrors: z
      .object({ name: z.string(), email: z.string(), role: z.string() })
      .partial(),
  }),
});
export const offset = z.union([z.number(), z.null()]).optional().default(0);
export const limit = z.union([z.number(), z.null()]).optional().default(50);
export const GetUsersQueryValidationErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("VALIDATION_ERROR"),
    status: z.literal(400),
    validationTarget: z.literal("query"),
    formErrors: z.string(),
    fieldErrors: z
      .object({
        sort: z.string(),
        q: z.string(),
        order: z.string(),
        offset: z.string(),
        limit: z.string(),
        role: z.string(),
      })
      .partial(),
  }),
});
export const CreatePostRequest = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1),
  public: z.boolean(),
  __target: z.literal("json").optional(),
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
export const CreatePostValidationErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("VALIDATION_ERROR"),
    status: z.literal(400),
    validationTarget: z.literal("json"),
    formErrors: z.string(),
    fieldErrors: z
      .object({ title: z.string(), body: z.string(), public: z.string() })
      .partial(),
  }),
});
export const GetPostsQueryValidationErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("VALIDATION_ERROR"),
    status: z.literal(400),
    validationTarget: z.literal("query"),
    formErrors: z.string(),
    fieldErrors: z
      .object({
        sort: z.string(),
        q: z.string(),
        order: z.string(),
        offset: z.string(),
        limit: z.string(),
      })
      .partial(),
  }),
});
export const UpdatePostRequest = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1),
  public: z.boolean(),
  __target: z.literal("json").optional(),
});
export const PostParamValidationErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("VALIDATION_ERROR"),
    status: z.literal(400),
    validationTarget: z.literal("param"),
    formErrors: z.string(),
    fieldErrors: z.object({ id: z.string() }).partial(),
  }),
});
export const UpdatePostValidationErrorResponse = z.object({
  error: z.object({
    message: z.string(),
    type: z.literal("VALIDATION_ERROR"),
    status: z.literal(400),
    validationTarget: z.literal("json"),
    formErrors: z.string(),
    fieldErrors: z
      .object({ title: z.string(), body: z.string(), public: z.string() })
      .partial(),
  }),
});

export const schemas = {
  UserPassword,
  SignUpRequest,
  User,
  SignUpResponse,
  BadRequestErrorResponse,
  SignUpValidationErrorResponse,
  UnauthorizedErrorResponse,
  ForbiddenErrorResponse,
  NotFoundErrorResponse,
  ServerErrorResponse,
  SignInRequest,
  SignInResponse,
  SignInValidationErrorResponse,
  UpdateUserRequest,
  UserParamValidationErrorResponse,
  UpdateUserValidationErrorResponse,
  offset,
  limit,
  GetUsersQueryValidationErrorResponse,
  CreatePostRequest,
  Post,
  CreatePostValidationErrorResponse,
  GetPostsQueryValidationErrorResponse,
  UpdatePostRequest,
  PostParamValidationErrorResponse,
  UpdatePostValidationErrorResponse,
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
        schema: BadRequestErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: UnauthorizedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: ForbiddenErrorResponse,
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: NotFoundErrorResponse,
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: ServerErrorResponse,
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
          BadRequestErrorResponse,
          CreatePostValidationErrorResponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: UnauthorizedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: ForbiddenErrorResponse,
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: NotFoundErrorResponse,
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: ServerErrorResponse,
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
          __target: z.literal("query").optional(),
        }),
        __: "______",
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
          BadRequestErrorResponse,
          GetPostsQueryValidationErrorResponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: UnauthorizedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: ForbiddenErrorResponse,
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: NotFoundErrorResponse,
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: ServerErrorResponse,
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
          BadRequestErrorResponse,
          PostParamValidationErrorResponse,
          UpdatePostValidationErrorResponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: UnauthorizedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: ForbiddenErrorResponse,
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: NotFoundErrorResponse,
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: ServerErrorResponse,
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
          BadRequestErrorResponse,
          PostParamValidationErrorResponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: UnauthorizedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: ForbiddenErrorResponse,
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: NotFoundErrorResponse,
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: ServerErrorResponse,
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
          BadRequestErrorResponse,
          PostParamValidationErrorResponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: UnauthorizedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: ForbiddenErrorResponse,
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: NotFoundErrorResponse,
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: ServerErrorResponse,
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
          BadRequestErrorResponse,
          SignInValidationErrorResponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: UnauthorizedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: ForbiddenErrorResponse,
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: NotFoundErrorResponse,
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: ServerErrorResponse,
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
          BadRequestErrorResponse,
          SignUpValidationErrorResponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: UnauthorizedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: ForbiddenErrorResponse,
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: NotFoundErrorResponse,
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: ServerErrorResponse,
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
          __target: z.literal("query").optional(),
        }),
        __: "_______",
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
          BadRequestErrorResponse,
          GetUsersQueryValidationErrorResponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: UnauthorizedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: ForbiddenErrorResponse,
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: NotFoundErrorResponse,
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: ServerErrorResponse,
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
          BadRequestErrorResponse,
          UserParamValidationErrorResponse,
          UpdateUserValidationErrorResponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: UnauthorizedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: ForbiddenErrorResponse,
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: NotFoundErrorResponse,
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: ServerErrorResponse,
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
          BadRequestErrorResponse,
          UserParamValidationErrorResponse,
        ]),
      },
      {
        status: 401,
        description: `Unauthorized: authentication required.`,
        schema: UnauthorizedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden: insufficient permissions.`,
        schema: ForbiddenErrorResponse,
      },
      {
        status: 404,
        description: `Not found: resource does not exist.`,
        schema: NotFoundErrorResponse,
      },
      {
        status: 500,
        description: `Server error: something went wrong.`,
        schema: ServerErrorResponse,
      },
    ],
  },
  // ]) as const;
} as const;

// export const api = new Zodios(endpoints);

// export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
//     return new Zodios(baseUrl, endpoints, options);
// }
