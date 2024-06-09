import { AppErrorStatusCode, type ErrorType, formatToHttpStatusCode } from "@/lib/status-code";
import { z } from "@hono/zod-openapi";
import { errorResponseSchema } from "./common-schemas";

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

export const createTypedValidationErrorResponseSchema = <Keys extends string[]>({
  target,
  keys,
}: { target: ValidationTarget; keys: Keys }) => {
  const fieldErrorSchemas = Object.fromEntries(keys.map((k) => [k, z.string().optional()]));

  const errorType = "VALIDATION_ERROR" satisfies ErrorType;

  return errorResponseSchema.merge(
    z.object({
      error: errorResponseSchema.shape.error.merge(
        z.object({
          type: z.literal(errorType),
          status: z.literal(formatToHttpStatusCode(AppErrorStatusCode[errorType])),
          severity: z.literal("error"),
          validationTarget: z.literal(target),
          formErrors: z.string(),
          fieldErrors: z.object(fieldErrorSchemas),
        }),
      ),
    }),
  );
};
