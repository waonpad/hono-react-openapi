import type { User } from "@/schemas/generated";

export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  // これを狙ってinvalidateすることは無い(実質できない)
  list: (filters: object) => [...usersKeys.lists(), filters] as const,
  // これを狙ってinvalidateすることは無い(実質できない)
  // listとはレスポンスの型が同じでもキャッシュに入る型が異なるため、別のキーにする
  infiniteList: (filters: object) => [...usersKeys.lists(), "infinite", filters] as const,
  details: () => [...usersKeys.all, "details"] as const,
  detail: (id: typeof User._type.id) => [...usersKeys.details(), id] as const,
  me: () => [...usersKeys.all, "me"] as const,
};
