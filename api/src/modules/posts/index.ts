import { defaultHook } from "@/lib/default-hook";
import { errorResponse } from "@/lib/errors";
import { z } from "@/lib/ja-zod";
import { getOrderColumn } from "@/lib/order-column";
import { postsTable } from "@/schemas/posts";
import { CustomHono, type JwtPayload } from "@/types/common";
import { and, count, eq, ilike, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createPostConfig, deletePostConfig, getPostByIdRouteConfig, getPostsConfig, updatePostConfig } from "./routes";
import { postSchema } from "./schemas";

/**
 * 投稿関連のエンドポイント
 */
const postsRoutes = new CustomHono({ defaultHook })
  /**
   * 投稿の作成
   */
  .openapi(createPostConfig, async (c) => {
    const { sub } = c.get("jwtPayload") as JwtPayload;

    const db = drizzle(c.env.DB);

    const { title, body, public: isPublic } = c.req.valid("json");

    const [createdPost] = await db
      .insert(postsTable)
      .values({
        title,
        body,
        public: isPublic,
        authorId: sub,
      })
      .returning();

    return c.json(postSchema.parse(createdPost), 201);
  })
  /**
   * 投稿情報更新
   */
  .openapi(updatePostConfig, async (c) => {
    const { id: postId } = c.req.valid("param");
    const { sub } = c.get("jwtPayload") as JwtPayload;

    const db = drizzle(c.env.DB);

    const targetPost = await db.select().from(postsTable).where(eq(postsTable.id, postId)).get();

    if (!targetPost) {
      return errorResponse({
        c,
        message: "Post not found",
        status: 404,
        type: "not_found",
        severity: "warn",
        resourceType: "POST",
        eventData: {
          id: postId,
        },
      });
    }

    if (targetPost.authorId !== sub) {
      return errorResponse({
        c,
        message: "You can only update your own post",
        status: 403,
        type: "forbidden",
        severity: "warn",
        resourceType: "POST",
        eventData: {
          id: postId,
        },
      });
    }

    const { title, body, public: isPublic } = c.req.valid("json");

    const [updatedPost] = await db
      .update(postsTable)
      .set({
        title,
        body,
        public: isPublic,
        updatedAt: sql`(CURRENT_TIMESTAMP)`,
      })
      .where(eq(postsTable.id, postId))
      .returning();

    return c.json(postSchema.parse(updatedPost), 200);
  })
  /**
   * 投稿一覧
   */
  .openapi(getPostsConfig, async (c) => {
    const { q, sort, order, offset, limit } = c.req.valid("query");

    const { sub } = (c.get("jwtPayload") ?? { sub: undefined }) as JwtPayload | { sub: undefined };

    const orderColumn = getOrderColumn(
      {
        id: postsTable.id,
        title: postsTable.title,
        body: postsTable.body,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt,
      },
      sort,
      postsTable.id,
      order,
    );

    const filters = [or(eq(postsTable.public, true), eq(postsTable.authorId, sub ?? ""))];
    if (q) {
      filters.push(or(ilike(postsTable.title, `%${q}%`), ilike(postsTable.body, `%${q}%`)));
    }

    const db = drizzle(c.env.DB);

    const postsQuery = db
      .select()
      .from(postsTable)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(orderColumn);

    const [{ total }] = await db.select({ total: count() }).from(postsQuery.as("posts"));

    const result = await postsQuery.limit(Number(limit)).offset(Number(offset));

    const posts = z.array(postSchema).parse(result);

    return c.json(
      {
        data: {
          items: posts,
          total,
        },
      },
      200,
    );
  })
  /**
   * 投稿の詳細情報
   */
  .openapi(getPostByIdRouteConfig, async (c) => {
    const id = c.req.param("id");

    const { sub } = (c.get("jwtPayload") ?? { sub: undefined }) as JwtPayload | { sub: undefined };

    const db = drizzle(c.env.DB);

    const post = await db
      .select()
      .from(postsTable)
      .where(and(eq(postsTable.id, id), or(eq(postsTable.public, true), eq(postsTable.authorId, sub ?? ""))))
      .get();

    if (!post) {
      return errorResponse({
        c,
        message: "Post not found",
        status: 404,
        type: "not_found",
        severity: "warn",
        resourceType: "POST",
        eventData: {
          id,
        },
      });
    }

    return c.json(postSchema.parse(post), 200);
  })
  /**
   * 投稿の削除
   */
  .openapi(deletePostConfig, async (c) => {
    const id = c.req.param("id");
    const { sub } = c.get("jwtPayload") as JwtPayload;

    const db = drizzle(c.env.DB);

    const targetPost = await db.select().from(postsTable).where(eq(postsTable.id, id)).get();

    if (!targetPost) {
      return errorResponse({
        c,
        message: "Post not found",
        status: 404,
        type: "not_found",
        severity: "warn",
        resourceType: "POST",
        eventData: {
          id,
        },
      });
    }

    if (targetPost.authorId !== sub) {
      return errorResponse({
        c,
        message: "You can only delete your own post",
        status: 403,
        type: "forbidden",
        severity: "warn",
        resourceType: "POST",
        eventData: {
          id,
        },
      });
    }

    await db.delete(postsTable).where(eq(postsTable.id, id));

    return c.newResponse(null, 204);
  });

export default postsRoutes;

export type PostsRoutes = typeof postsRoutes;
