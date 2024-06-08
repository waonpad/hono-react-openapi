import { useAuth } from "@/auth/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUp, useSignUpMutation } from "../../api/sign-up";

export const signUpFormSchema = signUp.endpoint.parameters.body.schema;

export const SignUp = () => {
  const { signUp: signUpFn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof signUpFormSchema._input>({
    resolver: zodResolver(signUpFormSchema),
  });

  const { mutateAsync, isPending } = useSignUpMutation();

  const onSubmit = handleSubmit(async (data: typeof signUpFormSchema._type) => {
    const [res, error] = await mutateAsync({ body: { ...data } });

    if (error) {
      // エラーに応じた処理
      throw error;
    }

    signUpFn(res);

    // 成功時の処理
    console.log("Signed up", res);
  });

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>Sign Up</h1>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <input {...register("name")} style={{ width: "100%", boxSizing: "border-box" }} />
          {errors.name && <p style={{ margin: 0 }}>{errors.name.message}</p>}
        </div>
        <div>
          <input {...register("email")} style={{ width: "100%", boxSizing: "border-box" }} />
          {errors.email && <p style={{ margin: 0 }}>{errors.email.message}</p>}
        </div>
        <div>
          <input {...register("password")} style={{ width: "100%", boxSizing: "border-box" }} />
          {errors.password && <p style={{ margin: 0 }}>{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};
