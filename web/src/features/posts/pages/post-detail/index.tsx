import { useNavigate, useParams } from "react-router-dom";
import { usePostQuery } from "../../api/get-post";
import { DeletePostButton } from "../../components/delete-post-button";
import { EditPostLinkButton } from "../../components/edit-post-link-button";

export const PostDetail = () => {
  const { id: _id } = useParams<{ id: string }>();
  const id = _id as NonNullable<typeof _id>;

  const navigate = useNavigate();

  const {
    data: [post, error],
  } = usePostQuery({ init: { params: { id } } });

  if (error) {
    // エラーに応じた処理
    throw error;
  }

  /**
   * 詳細ページで削除した場合表示するものが無くなるので、 \
   * 前のページか投稿一覧ページに遷移する \
   */
  const handleDeletePostButtonClick = () => {
    // /postsに遷移する
    // navigate("/posts");

    // 前のページに戻る
    navigate(-1);
  };

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>Post Detail</h1>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <EditPostLinkButton postId={post.id}>Edit</EditPostLinkButton>
        <DeletePostButton postId={post.id} onClick={handleDeletePostButtonClick}>
          Delete
        </DeletePostButton>
      </div>
    </div>
  );
};
