import type { PageResourceType } from "@/types/common";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { z } from "../lib/ja-zod";
import type { errorSchema, errorTypeSchema } from "./common-schemas";

/**
 * ログレベルを定義
 */
export const severitySchema = z.enum(["debug", "info", "log", "warn", "error"]);

/**
 * エラーログ用の型定義
 */
export type ErrorType = typeof errorSchema._type & {
  eventData?: EventData;
  name?: Error["name"];
};

/**
 * エラーの詳細情報を入れるオブジェクトの型定義
 */
export type EventData = {
  readonly [key: string]: number | string | boolean;
};

/**
 * エラーレスポンスをjson形式に詰め替えて返す関数
 */
export const errorResponse = ({
  c,
  message,
  status,
  type,
  severity,
  resourceType,
  eventData,
  err,
}: {
  c: Context;
  message: string;
  status: StatusCode;
  type: z.infer<typeof errorTypeSchema>;
  severity: z.infer<typeof severitySchema>;
  resourceType?: PageResourceType;
  eventData?: EventData;
  err?: Error;
}): ReturnType<Context["json"]> => {
  const error: ErrorType = {
    message,
    type: type || "server_error",
    status,
    severity: severity || "info",
    logId: c.get("logId"),
    path: c.req.path,
    method: c.req.method,
    resourceType,
    // usr: jwtPayloadからidを取りたいが、try-catchでもエラーになってしまうので一旦コメントアウト
  };

  if (err || ["warn", "error"].includes(severity)) {
    const data = { ...error, eventData };

    console.error(err, data);
  }

  return c.json({ error }, status);
};
