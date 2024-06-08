import { getEntries } from "@/utils";
import { useParams } from "react-router-dom";
import { useUserQuery } from "../../api/get-user";

export const UserDetail = () => {
  const { id: _id } = useParams<{ id: string }>();
  const id = _id as NonNullable<typeof _id>;

  const {
    data: [user, error],
  } = useUserQuery({ init: { params: { id } } });

  if (error) {
    // エラーに応じた処理
    throw error;
  }

  const { name, ...userDetail } = user;

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>User Detail</h1>
      <h2>{name}</h2>
      {getEntries(userDetail).map(([key, value]) => (
        <p key={key}>
          <strong>{key}</strong>: {value}
        </p>
      ))}
    </div>
  );
};
