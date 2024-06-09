import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { usePostQuery } from "../../api/get-post";
import { updatePost, useUpdatePostMutation } from "../../api/update-post";

/**
 * 投稿更新時にフォームで入力される値のスキーマ(一旦テキトー)
 */
export const updatePostFormSchema = updatePost.endpoint.parameters.body.schema;

export const EditPost = () => {
  const { id: _id } = useParams<{ id: string }>();
  const id = _id as NonNullable<typeof _id>;

  const {
    data: [post, error],
  } = usePostQuery({ init: { params: { id: id } } });

  if (error) {
    // エラーに応じた処理
    throw error;
  }

  const { mutateAsync, isPending } = useUpdatePostMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<typeof updatePostFormSchema._input>({
    defaultValues: { title: post.title, body: post.body },
    resolver: zodResolver(updatePostFormSchema),
  });

  const onSubmit = handleSubmit(async (data: typeof updatePostFormSchema._type) => {
    const [updatedPost, error] = await mutateAsync({
      params: { id: post.id },
      body: data,
    });

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
    console.log("Updated", updatedPost);
  });

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>Edit Post</h1>
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
          {isPending ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};
