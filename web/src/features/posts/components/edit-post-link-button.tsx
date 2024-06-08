import { LinkButton } from "@/components/elements/button/link-button";
import type { Post } from "@/schemas/generated";
import type { ComponentPropsWithoutRef } from "react";

/**
 * このコンポーネントはドメイン知識を持っているが、HTML構造がシンプルなため、propsを受け取ってみる
 */
type Props = Omit<ComponentPropsWithoutRef<typeof LinkButton>, "to"> & {
  postId: typeof Post._type.id;
};

export const EditPostLinkButton = ({ postId, ...rest }: Props) => {
  return <LinkButton {...rest} to={`/posts/${postId}/edit`} role="button" />;
};
