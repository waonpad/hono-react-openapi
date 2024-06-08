import { usersKeys } from "@/features/users/api/_keys";
import { createContract } from "@/lib/contract";
import { createUseMutation, queryClient } from "@/lib/tanstack-query";

export const signIn = createContract("postSignIn");

export const useSignInMutation = createUseMutation({
  mutationFn: signIn.fetcher,
  onSuccess: async ([data, error]) => {
    if (!error) {
      await queryClient.invalidateQueries({
        queryKey: usersKeys.detail(data.user.id),
      });
    }
  },
});
