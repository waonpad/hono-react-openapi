import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { usePostQuery } from "../../api/get-post";
import { useUpdatePostMutation } from "../../api/update-post";

/**
 * 投稿更新時にフォームで入力される値のスキーマ(一旦テキトー)
 */
export const updatePostFormSchema = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(1000),
});

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
  } = useForm<typeof updatePostFormSchema._input>({
    defaultValues: { title: post.title, body: post.body },
    resolver: zodResolver(updatePostFormSchema),
  });

  const onSubmit = handleSubmit(async (data: typeof updatePostFormSchema._type) => {
    const [updatedPost, error] = await mutateAsync({
      params: { id: post.id },
      body: { ...data, public: post.public },
    });

    if (error) {
      // エラーに応じた処理

      // バリデーションエラーでない場合はエラーを投げる
      throw error;
    }

    // 成功時の処理
    console.log("Updated", updatedPost);
  });

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>Edit Post</h1>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <input {...register("title")} style={{ width: "100%", boxSizing: "border-box" }} />
          {errors.title && <p style={{ margin: 0 }}>{errors.title.message}</p>}
        </div>
        <div>
          <input {...register("body")} style={{ width: "100%", boxSizing: "border-box" }} />
          {errors.body && <p style={{ margin: 0 }}>{errors.body.message}</p>}
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};
