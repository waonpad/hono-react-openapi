import { useAuth } from "@/auth/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { signIn, useSignInMutation } from "../../api/sign-in";

export const signInFormSchema = signIn.endpoint.parameters.body.schema;

export const SignIn = () => {
  const { signIn: signInFn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof signInFormSchema._input>({
    resolver: zodResolver(signInFormSchema),
  });

  const { mutateAsync, isPending } = useSignInMutation();

  const onSubmit = handleSubmit(async (data: typeof signInFormSchema._type) => {
    const [res, error] = await mutateAsync({ body: { ...data } });

    if (error) {
      // エラーに応じた処理
      throw error;
    }

    signInFn(res);

    // 成功時の処理
    console.log("Signed in", res);
  });

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>Sign In</h1>
      <Link to="/auth/sign-up">Sign up</Link>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <input {...register("email")} style={{ width: "100%", boxSizing: "border-box" }} />
          {errors.email && <p style={{ margin: 0 }}>{errors.email.message}</p>}
        </div>
        <div>
          <input {...register("password")} style={{ width: "100%", boxSizing: "border-box" }} />
          {errors.password && <p style={{ margin: 0 }}>{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};
