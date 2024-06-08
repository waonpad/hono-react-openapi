import { createContract } from "@/lib/contract";
import { createUseMutation, queryClient } from "@/lib/tanstack-query";
import { postsKeys } from "./_keys";

export const deletePost = createContract("deletePostsId");

export const useDeletePostMutation = createUseMutation({
  mutationFn: deletePost.fetcher,
  onSuccess: async ([, error], variables) => {
    if (!error) {
      await queryClient.invalidateQueries({
        queryKey: postsKeys.detail(variables.params.id),
      });
    }
  },
});
