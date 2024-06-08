import { errorResponse } from "@/lib/errors";
import { AppErrorStatusCode } from "@/lib/status-code";
import type { Env } from "@/types/common";
import type { Context, Next } from "hono";
import { verify } from "hono/jwt";

export const setUser = () => async (c: Context<Env>, next: Next) => {
  // authorizationヘッダーを取得
  const authorization = c.req.header("authorization");

  // authorizationヘッダーがない場合は次のミドルウェアへ
  if (!authorization) {
    await next();
    return;
  }

  // authorizationヘッダーがある場合はトークンを取得
  const token = authorization.split(" ")[1];

  // トークンがbearer-tokenの場合は次のミドルウェアへ(openapiのドキュメントにはbearer-tokenというトークンを使っている)
  // TODO: 実際に使う時はなんかいい感じにやる
  if (token === "bearer-token") {
    await next();
    return;
  }

  try {
    // トークンを検証
    const payload = await verify(token, c.env.JWT_SECRET);

    // 検証した結果をコンテキストにセット
    c.set("jwtPayload", payload);

    await next();
    return;
  } catch {
    // トークンが不正な場合はエラーレスポンスを返す
    return errorResponse(c, {
      message: "Invalid token",
      status: AppErrorStatusCode.UNAUTHORIZED,
      severity: "warn",
      resourceType: "USER",
    });
  }
};
