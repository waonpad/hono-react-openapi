import { createContract } from "@/lib/contract";
import { type QC, type UseQueryOptions, useQuery } from "@/lib/tanstack-query";
import { usersKeys } from "./_keys";

export const getMe = createContract("getMe");

export const useMeQuery = ({
  init,
  config,
}: {
  init: Parameters<typeof getMe.fetcher>[0];
  config?: QC<UseQueryOptions<Awaited<ReturnType<typeof getMe.fetcher>>, never>>;
}) => {
  return useQuery({
    ...config,
    queryKey: usersKeys.me(),
    queryFn: () => getMe.fetcher(init),
  });
};
