import { useAuth } from "@/auth/use-auth";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (
    <>
      <div>layout</div>
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/posts/create">Create Post</Link>
        <Link to="/users">Users</Link>
        {user ? <Link to={`/users/${user.id}`}>Profile</Link> : <Link to="/auth/sign-in">Sign In</Link>}
      </div>
      <main
        style={{
          marginTop: 12,
        }}
      >
        {children}
      </main>
    </>
  );
};
