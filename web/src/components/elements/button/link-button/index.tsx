import type { ComponentPropsWithoutRef } from "react";
import { Link } from "react-router-dom";

type Props = ComponentPropsWithoutRef<typeof Link>;

export const LinkButton = ({ ...rest }: Props) => {
  return (
    // TODO: 実際のプロジェクトではリセットcssの適用後、ボタンと同じスタイルにする
    <Link {...rest} role="button" />
  );
};
