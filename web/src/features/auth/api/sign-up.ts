import { usersKeys } from "@/features/users/api/_keys";
import { createContract } from "@/lib/contract";
import { createUseMutation, queryClient } from "@/lib/tanstack-query";

export const signUp = createContract("postSignUp");

export const useSignUpMutation = createUseMutation({
  mutationFn: signUp.fetcher,
  onSuccess: async ([data, error]) => {
    if (!error) {
      await queryClient.invalidateQueries({
        queryKey: usersKeys.detail(data.user.id),
      });
    }
  },
});
