import { HttpError, type HttpErrorType } from "@/constants/errors";
import type { z } from "@/lib/zod/i18n/ja";
import { endpoints } from "@/schemas/generated";
import { type Options, destroy, get, patch, post, put } from "../fetcher";

export const createContract = <
  OperationName extends keyof typeof endpoints,
  Operation extends (typeof endpoints)[OperationName],
>(
  operationName: OperationName,
) => {
  return {
    endpoint: endpoints[operationName],
    fetcher: async <
      ExRequestInit extends Options<
        Operation extends {
          parameters: { path: { schema: z.ZodTypeAny; __: "" } };
        }
          ? undefined
          : z.input<Operation["parameters"]["path"]["schema"]>,
        Operation extends {
          parameters: { query: { schema: z.ZodTypeAny; __: "" } };
        }
          ? undefined
          : z.input<Operation["parameters"]["query"]["schema"]>,
        Operation extends {
          parameters: { body: { schema: z.ZodTypeAny } };
        }
          ? z.input<Operation["parameters"]["body"]["schema"]>
          : undefined
      >,
    >(
      init: ExRequestInit,
    ): Promise<
      [z.infer<Operation["response"]>, null] | [null, HttpErrorType<z.infer<Operation["errors"][number]["schema"]>>]
    > => {
      const operation = endpoints[operationName];
      const { path, query, body } = operation.parameters;

      /**
       * パスパラメータのバリデーション
       */
      if (path.schema && path.__ !== "") {
        const { data, success, error: zodError } = path.schema.safeParse(init.params);

        if (!success) {
          console.warn(zodError.errors);

          const error = new HttpError("パスパラメータが不正です", { status: 400 });

          // @ts-ignore
          return [null, error];
        }

        // バリデーション後の値をパスパラメータにセット
        init.params = data;
      }

      /**
       * クエリパラメータのバリデーション
       */
      if (query.schema && query.__ !== "") {
        const { data, success, error: zodError } = query.schema.safeParse(init.searchParams);

        if (!success) {
          console.warn(zodError.errors);

          const error = new HttpError("クエリパラメータが不正です", { status: 400 });

          // @ts-ignore
          return [null, error];
        }

        // バリデーション後の値をクエリパラメータにセット
        init.searchParams = data;
      }

      /**
       * リクエストボディのバリデーション
       */
      if ("schema" in body) {
        const { data, success, error: zodError } = body.schema.safeParse(init.body);

        if (!success) {
          console.warn(zodError.errors);

          const error = new HttpError("リクエストボディが不正です", { status: 400 });

          // @ts-ignore
          return [null, error];
        }

        // バリデーション後の値をリクエストボディにセット
        init.body = data;
      }

      const [res, error] = await (async () => {
        try {
          const res = await {
            get: get<z.infer<Operation["response"]>>,
            post: post<z.infer<Operation["response"]>>,
            put: put<z.infer<Operation["response"]>>,
            patch: patch<z.infer<Operation["response"]>>,
            delete: destroy<z.infer<Operation["response"]>>,
          }[operation.method](
            operation.path,
            // @ts-ignore
            init,
          );

          return [res, null];
        } catch (error) {
          if (error instanceof HttpError) return [null, error];

          // ネットワークエラーなど
          return [null, new HttpError("エラーが発生しました", { status: 500 })];
        }
      })();

      if (error) {
        // @ts-ignore
        return [null, error];
      }

      /**
       * レスポンスのバリデーション
       */
      const { data, success, error: zodError } = operation.response.safeParse(res);

      if (!success) {
        console.warn(zodError.errors);

        const error = new HttpError("レスポンスが不正です", { status: 500 });

        // @ts-ignore
        return [null, error];
      }

      // バリデーション後の値を返却

      // @ts-ignore
      return [data, null];
    },
  };
};
