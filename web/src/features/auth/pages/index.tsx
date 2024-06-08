import { Route, Routes } from "react-router-dom";
import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
    </Routes>
  );
};
