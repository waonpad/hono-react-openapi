import { type DefaultOptions, type MutationFunction, QueryClient, useMutation } from "@tanstack/react-query";

export * from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    /**
     * キャッシュの有効期限 \
     * バックエンドへのリクエスト数に関わる重要な設定
     */
    staleTime: 0,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type QC<T> = Omit<T, "queryKey" | "queryFn">;

export const createUseMutation = <
  TError,
  MFn extends MutationFunction<Awaited<ReturnType<MFn>>, Parameters<MFn>[0]>,
  MConf extends Parameters<typeof useMutation<Awaited<ReturnType<MFn>>, TError, Parameters<MFn>[0]>>[0],
>(
  config: Omit<MConf, "mutationFn"> & { mutationFn: MFn; _TError?: TError },
) => {
  return (config2?: Omit<MConf, "mutationFn">) => {
    return useMutation({
      ...config,
      ...config2,
      onError: (...args) => {
        config?.onError?.(...args);
        config2?.onError?.(...args);
      },
      onMutate: (...args) => {
        config?.onMutate?.(...args);
        config2?.onMutate?.(...args);
      },
      onSuccess: (...args) => {
        config?.onSuccess?.(...args);
        config2?.onSuccess?.(...args);
      },
      onSettled: (...args) => {
        config?.onSettled?.(...args);
        config2?.onSettled?.(...args);
      },
      mutationFn: config.mutationFn,
    });
  };
};
