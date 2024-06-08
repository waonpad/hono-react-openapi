import { HTTPException } from "hono/http-exception";
import { defaultHook } from "./lib/default-hook";
import { docs } from "./lib/docs";
import { errorResponse } from "./lib/errors";
import { AppErrorStatusCode, type HttpErrorStatusCode } from "./lib/status-code";
import { middlewares } from "./middlewares";
import authRoutes from "./modules/auth";
import { jsxRoutes } from "./modules/jsx";
import postsRoutes from "./modules/posts";
import usersRoutes from "./modules/users";
import { CustomHono } from "./types/common";

/**
 * バリデーションエラーが発生した時のデフォルト処理を全体に登録
 */
const app = new CustomHono({ defaultHook });

/**
 * 全てのルートに共通のミドルウェアを適用
 */
app.route("", middlewares);

/**
 * Open APIドキュメントのエンドポイントを登録
 */
docs(app);

/**
 * 404エラー時の共通処理
 */
app.notFound((c) => {
  return errorResponse(c, {
    message: "Route not found",
    status: AppErrorStatusCode.NOT_FOUND,
    severity: "warn",
    eventData: {
      path: c.req.path,
      method: c.req.method,
    },
  });
});

/**
 * サーバーエラー時の共通処理
 */
app.onError((err, c) => {
  // jwtミドルウェアでauthorizationヘッダーがなかったときなど、honoが例外を投げるのでここに入ってくる
  if (err instanceof HTTPException) {
    return errorResponse(c, {
      message: err.message,
      status: err.status as HttpErrorStatusCode,
      severity: "error",
      err,
    });
  }

  return errorResponse(c, {
    message: "Unexpected error",
    status: AppErrorStatusCode.SERVER_ERROR,
    severity: "error",
    err,
  });
});

/**
 * アプリに各モジュールのエンドポイントを登録
 */
app.route("/", authRoutes).route("/", usersRoutes).route("/", postsRoutes).route("/", jsxRoutes);

/**
 * アプリを起動する
 */
export default app;
