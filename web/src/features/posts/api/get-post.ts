import { createContract } from "@/lib/contract";
import { type QC, type UseSuspenseQueryOptions, useSuspenseQuery } from "@/lib/tanstack-query";
import { postsKeys } from "./_keys";

export const getPost = createContract("getPostsId");

export const usePostQuery = ({
  init,
  config,
}: {
  init: Parameters<typeof getPost.fetcher>[0];
  config?: QC<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getPost.fetcher>>, never>>;
}) => {
  return useSuspenseQuery({
    ...config,
    queryKey: postsKeys.detail(init.params.id),
    queryFn: () => getPost.fetcher(init),
  });
};
