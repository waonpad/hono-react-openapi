import { Navigate, Route, Routes } from "react-router-dom";
import { CreatePost } from "./create-post";
import { EditPost } from "./edit-post";
import { PostDetail } from "./post-detail";
import { PostList } from "./post-list";

export const PostsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/:id" element={<PostDetail />} />
      <Route path="/:id/edit" element={<EditPost />} />
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
};
