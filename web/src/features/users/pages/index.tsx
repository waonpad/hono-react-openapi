import { Navigate, Route, Routes } from "react-router-dom";
import { UserDetail } from "./user-detail";
import { UserList } from "./user-list";

export const UsersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserList />} />
      <Route path="/:id" element={<UserDetail />} />
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
};
