import { createContract } from "@/lib/contract";
import { createUseMutation, queryClient } from "@/lib/tanstack-query";
import { postsKeys } from "./_keys";

export const createPost = createContract("postPosts");

export const useCreatePostMutation = createUseMutation({
  mutationFn: createPost.fetcher,
  onSuccess: async ([, error]) => {
    if (!error) {
      await queryClient.invalidateQueries({
        queryKey: postsKeys.lists(),
      });
    }
  },
});
