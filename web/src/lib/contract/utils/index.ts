import { endpoints } from "@/schemas/generated";
import type { z } from "zod";
import type { createContract } from "..";

/**
 * @description
 * useQuery系はレスポンスを変える要因になるパラメータを全てqueryKeyに含める必要がある
 *
 * queryKeyが決定した後にcreateContract内でスキーマをパースすると、 \
 * デフォルト値等の挿入によってqueryKeyに含めているデータと実際にリクエストするパラメータが異なる可能性がある
 *
 * キャッシュに保持するデータが壊れるのを防ぐため、この関数でパースしたものをqueryKeyに含める
 */
export const getParsedOperationRequestParams = <T extends keyof typeof endpoints>({
  operationName,
  init,
}: {
  operationName: T;
  init: Pick<
    Parameters<ReturnType<typeof createContract<T, (typeof endpoints)[T]>>["fetcher"]>[0],
    "params" | "searchParams"
  >;
}): {
  params: (typeof init)["params"] extends z.ZodType<infer P> ? P : never;
  searchParams: (typeof init)["searchParams"] extends z.ZodType<infer S> ? S : never;
} => {
  // @ts-ignore
  return {
    ...(endpoints[operationName].parameters.path && endpoints[operationName].parameters.path.__ !== ""
      ? { params: endpoints[operationName].parameters.path.schema.parse(init.params) }
      : {}),
    ...(endpoints[operationName].parameters.query && endpoints[operationName].parameters.query.__ !== ""
      ? { searchParams: endpoints[operationName].parameters.query.schema.parse(init.searchParams) }
      : {}),
  };
};
