import type { Post } from "@/schemas/generated";

export const postsKeys = {
  all: ["posts"] as const,
  lists: () => [...postsKeys.all, "list"] as const,
  // これを狙ってinvalidateすることは無い(実質できない)
  list: (filters: object) => [...postsKeys.lists(), filters] as const,
  // これを狙ってinvalidateすることは無い(実質できない)
  // listとはレスポンスの型が同じでもキャッシュに入る型が異なるため、別のキーにする
  infiniteList: (filters: object) => [...postsKeys.lists(), "infinite", filters] as const,
  details: () => [...postsKeys.all, "details"] as const,
  detail: (id: typeof Post._type.id) => [...postsKeys.details(), id] as const,
};
