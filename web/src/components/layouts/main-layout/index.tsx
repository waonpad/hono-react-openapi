import { useAuth } from "@/auth/use-auth";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth();

  const handleSignOutButtonClick = () => {
    signOut();
  };

  return (
    <>
      <div>layout</div>
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/posts/create">Create Post</Link>
        <Link to="/users">Users</Link>
        {user ? <Link to={`/users/${user.id}`}>Profile</Link> : <Link to="/auth/sign-in">Sign In</Link>}
        {user && (
          <button type="button" onClick={handleSignOutButtonClick}>
            Sign Out
          </button>
        )}
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
