import type { User } from "@/schemas/generated";
import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

/**
 * このコンポーネントはドメイン知識を持っていて汎用性が必要なく、HTML構造も複雑なため、propsは必要最小限しか受け取らない
 */
type Props = {
  users: (typeof User._type)[];
};

/**
 * 投稿リストはいろいろな方法で取得されるが、表示するものは同じなので、リストをコンポーネントとして切り出した
 */
export const UserListRenderer = ({ users }: Props) => {
  return (
    <div>
      {users.map((user) => (
        <Fragment key={user.id}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Link to={`/users/${user.id}`}>
              <p style={{ margin: 0, fontSize: 20 }}>{user.name}</p>
            </Link>
          </div>
          {users.indexOf(user) !== users.length - 1 && <hr style={{ marginTop: 16 }} />}
        </Fragment>
      ))}
    </div>
  );
};
