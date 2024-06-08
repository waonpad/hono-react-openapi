import { createContract } from "@/lib/contract";
import { type QC, type UseSuspenseQueryOptions, useSuspenseQuery } from "@/lib/tanstack-query";
import { usersKeys } from "./_keys";

export const getUser = createContract("getUsersId");

export const useUserQuery = ({
  init,
  config,
}: {
  init: Parameters<typeof getUser.fetcher>[0];
  config?: QC<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUser.fetcher>>, never>>;
}) => {
  return useSuspenseQuery({
    ...config,
    queryKey: usersKeys.detail(init.params.id),
    queryFn: () => getUser.fetcher(init),
  });
};
