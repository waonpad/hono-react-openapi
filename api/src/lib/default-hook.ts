import type { Hook } from "@hono/zod-openapi";
import { ZodError } from "zod";
import type { Env } from "../types/common";
import type { validationErrorResnponseSchema } from "./common-schemas";

/**
 * バリデーションエラーが発生した時のデフォルト処理
 */
export const defaultHook: Hook<unknown, Env, "", unknown> = (result, c) => {
  if (!result.success && result.error instanceof ZodError) {
    return c.json(
      {
        error: {
          status: 400,
          message: "バリデーションエラーが発生しました",
          type: "VALIDATION_ERROR",
          issues: result.error.issues,
        },
      } satisfies typeof validationErrorResnponseSchema._type,
      400,
    );
  }
};
