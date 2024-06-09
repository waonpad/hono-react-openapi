import { z } from "@/lib/ja-zod";
import type { ErrorType } from "@/lib/status-code";
import type { StatusCode } from "hono/utils/http-status";

export const ValidationTarget = ["json", "query", "header", "param", "cookie", "form"] as const;
export type ValidationTarget = (typeof ValidationTarget)[number];

export const ErrorTargetKey = "__target" as const;

export const createValidationSchemaWithTarget = <Target extends ValidationTarget, Schema extends z.AnyZodObject>({
  target,
  schema,
}: {
  target: Target;
  schema: Schema;
}) => {
  const targetSchema = z.object({ [ErrorTargetKey]: z.literal(target).optional() });

  const s = z.preprocess((val) => {
    const { data, success } = schema.safeParse(val);

    if (success) return { ...data, [ErrorTargetKey]: target };

    return {
      // @ts-ignore
      ...val,
      [ErrorTargetKey]: "invalid",
    };
  }, schema.merge(targetSchema));

  // ZodEffectsを強制的にZodObjectにアサーション
  // 返ってきたスキーマの使い方によっては壊れる可能性があることに注意
  return s as unknown as Schema & typeof targetSchema;
};

export const createTypedValidationErrorResponseSchema = <Schema extends z.AnyZodObject>({
  schema,
  paramsForThrowError,
  appendKeys,
  isParam,
}: { schema: Schema; paramsForThrowError?: unknown; appendKeys?: (keyof Schema["_type"])[]; isParam?: boolean }) => {
  const { error } = schema.safeParse(paramsForThrowError ?? {});

  if (!error) throw new Error("エラーを生成できませんでした");

  const target: ValidationTarget = (() => {
    if (isParam) return "param";

    const t = error.errors.find((e) => e.path[0] === ErrorTargetKey);

    if (t?.code === "invalid_literal") {
      return t.expected as ValidationTarget;
    }

    throw new Error("バリデーションターゲットが不正です");
  })();

  const flattened = error.flatten();

  const fieldErrors = flattened.fieldErrors;

  // fieldErrorsからErrorTargetKeyを削除
  delete fieldErrors[ErrorTargetKey];

  const entries = Object.entries(fieldErrors).map(([k]) => {
    return [k, z.string().optional()];
  });

  const appendKeyEntries = (appendKeys ?? []).map((k) => [k, z.string().optional()]);

  const mergedEntries = [...entries, ...appendKeyEntries];

  return z.object({
    error: z.object({
      message: z.string(),
      type: z.literal("VALIDATION_ERROR" satisfies ErrorType),
      status: z.literal(400 satisfies StatusCode),
      validationTarget: z.literal(target),
      formErrors: z.string(),
      fieldErrors: z.object(Object.fromEntries(mergedEntries)),
    }),
  });
};
