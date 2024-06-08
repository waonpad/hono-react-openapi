import { parse } from "qs";
import { useLocation } from "react-router-dom";
import { useUsersQuery } from "../../api/get-users";
import { UserListRenderer } from "../../components/user-list-renderer";

export const UserList = () => {
  const { search } = useLocation();

  const {
    data: [data, error],
  } = useUsersQuery({ init: { searchParams: parse(search, { ignoreQueryPrefix: true }) } });

  if (error) {
    // エラーに応じた処理
    throw error;
  }

  const users = data?.data.items;

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>Users</h1>
      <UserListRenderer users={users} />
    </div>
  );
};
