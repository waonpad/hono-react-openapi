import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./use-auth";

type Props = {
  children: ReactNode;
  redirect?: string;
};

export const AuthGuard = ({ children, redirect }: Props) => {
  const auth = useAuth();

  const location = useLocation();

  if (!auth.user) {
    return <Navigate to={redirect || "/auth/sign-in"} state={{ from: location }} replace={false} />;
  }

  return children;
};
