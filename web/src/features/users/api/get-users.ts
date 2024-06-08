import { createContract } from "@/lib/contract";
import { getParsedOperationRequestParams } from "@/lib/contract/utils";
import { type QC, type UseSuspenseQueryOptions, useSuspenseQuery } from "@/lib/tanstack-query";
import { usersKeys } from "./_keys";

export const getUsers = createContract("getUsers");

export const useUsersQuery = ({
  init,
  config,
}: {
  init: Parameters<typeof getUsers.fetcher>[0];
  config?: QC<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers.fetcher>>, never>>;
}) => {
  return useSuspenseQuery({
    ...config,
    queryKey: usersKeys.list(getParsedOperationRequestParams({ operationName: "getUsers", init })),
    queryFn: () => getUsers.fetcher(init),
  });
};
