import type { Hook } from "@hono/zod-openapi";
import { ZodError } from "zod";
import type { Env } from "../types/common";
import {
  ErrorTargetKey,
  type ValidationTarget,
  type createTypedValidationErrorResponseSchema,
} from "./typed-validation-error";

/**
 * バリデーションエラーが発生した時のデフォルト処理
 */
export const defaultHook: Hook<unknown, Env, "", unknown> = (result, c) => {
  if (!result.success && result.error instanceof ZodError) {
    const error = result.error;

    const target: ValidationTarget = (() => {
      const t = error.errors.find((e) => e.path[0] === ErrorTargetKey);

      if (t?.code === "invalid_literal") return t.expected as ValidationTarget;

      return "param";
    })();

    const { formErrors, fieldErrors } = error.flatten();

    // fieldErrorsからErrorTargetKeyを削除
    delete fieldErrors[ErrorTargetKey];

    return c.json(
      {
        error: {
          message: "バリデーションエラーが発生しました",
          type: "VALIDATION_ERROR",
          status: 400,
          validationTarget: target,
          formErrors: formErrors[0],
          fieldErrors: Object.fromEntries(Object.entries(fieldErrors).map(([key, value]) => [key, (value ?? [])[0]])),
        },
      } satisfies ReturnType<typeof createTypedValidationErrorResponseSchema>["_type"],
      400,
    );
  }
};
