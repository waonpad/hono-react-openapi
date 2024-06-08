import { z } from "@/lib/zod/i18n/ja";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreatePostMutation } from "../../api/create-post";

/**
 * 投稿作成時にフォームで入力される値のスキーマ(一旦テキトー)
 */
export const createPostFormSchema = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(1000),
});

export const CreatePost = () => {
  const { mutateAsync, isPending } = useCreatePostMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<typeof createPostFormSchema._input>({
    resolver: zodResolver(createPostFormSchema),
  });

  const onSubmit = handleSubmit(async (data: typeof createPostFormSchema._type) => {
    const [createdPost, error] = await mutateAsync({ body: { ...data, public: true } });

    if (error) {
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
        <div>
          <input {...register("title")} style={{ width: "100%", boxSizing: "border-box" }} />
          {errors.title && <p style={{ margin: 0 }}>{errors.title.message}</p>}
        </div>
        <div>
          <input {...register("body")} style={{ width: "100%", boxSizing: "border-box" }} />
          {errors.body && <p style={{ margin: 0 }}>{errors.body.message}</p>}
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};
