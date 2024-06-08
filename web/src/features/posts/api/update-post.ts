import { createContract } from "@/lib/contract";
import { createUseMutation, queryClient } from "@/lib/tanstack-query";
import { postsKeys } from "./_keys";

export const updatePost = createContract("putPostsId");

export const useUpdatePostMutation = createUseMutation({
  mutationFn: updatePost.fetcher,
  onSuccess: async ([data, error]) => {
    if (!error) {
      await queryClient.invalidateQueries({
        queryKey: postsKeys.detail(data.id),
      });
    }
  },
});
