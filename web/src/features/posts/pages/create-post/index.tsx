import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createPost, useCreatePostMutation } from "../../api/create-post";

export const createPostFormSchema = createPost.endpoint.parameters.body.schema;

export const CreatePost = () => {
  const { mutateAsync, isPending } = useCreatePostMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<typeof createPostFormSchema._input>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: { public: true },
  });

  const onSubmit = handleSubmit(async (data: typeof createPostFormSchema._type) => {
    const [createdPost, error] = await mutateAsync({ body: data });

    if (error) {
      if (error.details?.error.type === "VALIDATION_ERROR" && error.details?.error.validationTarget === "json") {
        const { formErrors, fieldErrors } = error.details.error;

        formErrors && setError("root", { message: formErrors });

        const { title, body, public: publicError } = fieldErrors;

        title && setError("title", { message: title });
        body && setError("body", { message: body });
        publicError && setError("public", { message: publicError });

        return;
      }

      // エラーに応じた処理
      throw error;
    }

    // 成功時の処理
    console.log("Created", createdPost);

    // フォームを初期値に戻す
    reset();
  });

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>Create Post</h1>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {errors.root && <p style={{ margin: 0 }}>{errors.root.message}</p>}
        <div>
          <input {...register("title")} style={{ width: "100%", boxSizing: "border-box" }} />
          {errors.title && <p style={{ margin: 0 }}>{errors.title.message}</p>}
        </div>
        <div>
          <input {...register("body")} style={{ width: "100%", boxSizing: "border-box" }} />
          {errors.body && <p style={{ margin: 0 }}>{errors.body.message}</p>}
        </div>
        <div>
          <label>
            <input type="checkbox" {...register("public")} />
            Public
          </label>
          {errors.public && <p style={{ margin: 0 }}>{errors.public.message}</p>}
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};
