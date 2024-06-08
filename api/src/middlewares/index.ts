import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { CustomHono } from "../types/common";
import { setUser } from "./user/set-user";

const app = new CustomHono();

// Secure headers
app.use("*", secureHeaders());

// CORS
app.use(
  "*",
  cors({
    origin: "*", // TODO: 実際にはフロントエンドのURLだけにする
    credentials: true,
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
    allowHeaders: [],
  }),
);

// CSRF protection
app.use(
  "*",
  csrf({
    origin: "*", // TODO: 実際にはフロントエンドのURLだけにする
  }),
);

// これが無いと、認証している状態でjwtミドルウェアを通していないエンドポイントにアクセスし、c.get("jwtPayload")した際エラーになる
app.use("*", setUser());

/**
 * 全てのルートに共通のミドルウェア
 */
export const middlewares = app;
