import { createContract } from "@/lib/contract";
import { getParsedOperationRequestParams } from "@/lib/contract/utils";
import { type QC, type UseSuspenseQueryOptions, useSuspenseQuery } from "@/lib/tanstack-query";
import { postsKeys } from "./_keys";

export const getPosts = createContract("getPosts");

export const usePostsQuery = ({
  init,
  config,
}: {
  init: Parameters<typeof getPosts.fetcher>[0];
  config?: QC<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getPosts.fetcher>>, never>>;
}) => {
  return useSuspenseQuery({
    ...config,
    queryKey: postsKeys.list(getParsedOperationRequestParams({ operationName: "getPosts", init })),
    queryFn: () => getPosts.fetcher(init),
  });
};
