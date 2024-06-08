import type { PageResourceType } from "@/types/common";
import type { Context } from "hono";
import { z } from "../lib/ja-zod";
import type { errorSchema, errorTypeSchema } from "./common-schemas";
import { AppErrorStatusCode, ErrorTypeMap, type HttpErrorStatusCode, formatToHttpStatusCode } from "./status-code";

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
export const errorResponse = (
  c: Context,
  {
    message,
    type,
    status,
    severity,
    resourceType,
    eventData,
    err,
  }: {
    message: string;
    severity: z.infer<typeof severitySchema>;
    resourceType?: PageResourceType;
    eventData?: EventData;
    err?: Error;
  } & (
    | {
        type: z.infer<typeof errorTypeSchema>;
        status?: never;
      }
    | {
        type?: never;
        status: AppErrorStatusCode | HttpErrorStatusCode;
      }
  ),
): ReturnType<Context["json"]> => {
  const { isAppErroCode, status: typedStatusCode } = status
    ? Object.values(AppErrorStatusCode).some((v) => v === status)
      ? ({
          isAppErroCode: true,
          status: status as AppErrorStatusCode,
        } as const)
      : ({
          isAppErroCode: false,
          status: status as HttpErrorStatusCode,
        } as const)
    : ({
        isAppErroCode: true,
        status: AppErrorStatusCode[type],
      } as const);

  const error: ErrorType = {
    message,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    type: type || ErrorTypeMap.get(isAppErroCode ? typedStatusCode : 500)!,
    status: status
      ? formatToHttpStatusCode(isAppErroCode ? typedStatusCode : 500)
      : formatToHttpStatusCode(AppErrorStatusCode[type]),
    severity: severity || "info",
    logId: c.get("logId"),
    path: c.req.path,
    method: c.req.method,
    resourceType,
    // usr: jwtPayloadからidを取りたい
  };

  if (err || ["warn", "error"].includes(severity)) {
    const data = { ...error, eventData };

    console.error(err, data);
  }

  return c.json(
    { error },
    status
      ? formatToHttpStatusCode(isAppErroCode ? typedStatusCode : 500)
      : formatToHttpStatusCode(AppErrorStatusCode[type]),
  );
};
