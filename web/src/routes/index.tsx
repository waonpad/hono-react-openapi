import { PublicGuard } from "@/auth/public-guard";
import { SuspenseFallback } from "@/components/elements/suspense-fallback";
import { MainLayout } from "@/components/layouts/main-layout";
import { lazyImport } from "@/utils/lazy-import";
import { Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";

const { NotFound } = lazyImport(() => import("@/features/misc/pages/not-found"), "NotFound");

const { PostsRoutes } = lazyImport(() => import("@/features/posts/pages"), "PostsRoutes");

const { PostList } = lazyImport(() => import("@/features/posts/pages/post-list"), "PostList");

const { UsersRoutes } = lazyImport(() => import("@/features/users/pages"), "UsersRoutes");

const { AuthRoutes } = lazyImport(() => import("@/features/auth/pages"), "AuthRoutes");

const App = () => {
  return (
    <MainLayout>
      <Suspense fallback={<SuspenseFallback />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/auth/*"
        element={
          <PublicGuard redirect="/">
            <AuthRoutes />
          </PublicGuard>
        }
      />
      <Route path="/" element={<App />}>
        <Route index={true} element={<PostList />} />
        <Route path="/posts/*" element={<PostsRoutes />} />
        <Route path="/users/*" element={<UsersRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
