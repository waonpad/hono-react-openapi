import type { Post } from "@/schemas/generated";
import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { DeletePostButton } from "./delete-post-button";
import { EditPostLinkButton } from "./edit-post-link-button";

/**
 * このコンポーネントはドメイン知識を持っていて汎用性が必要なく、HTML構造も複雑なため、propsは必要最小限しか受け取らない
 */
type Props = {
  posts: (typeof Post._type)[];
};

/**
 * 投稿リストはいろいろな方法で取得されるが、表示するものは同じなので、リストをコンポーネントとして切り出した
 */
export const PostListRenderer = ({ posts }: Props) => {
  return (
    <div>
      {posts.map((post) => (
        <Fragment key={post.id}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Link to={`/posts/${post.id}`}>
              <p style={{ margin: 0, fontSize: 20 }}>{post.title}</p>
            </Link>
            <p style={{ margin: 0 }}>{post.body}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <EditPostLinkButton postId={post.id}>Edit</EditPostLinkButton>
              <DeletePostButton postId={post.id} indicator={"Deleting"}>
                Delete
              </DeletePostButton>
            </div>
          </div>
          {posts.indexOf(post) !== posts.length - 1 && <hr style={{ marginTop: 16 }} />}
        </Fragment>
      ))}
    </div>
  );
};
