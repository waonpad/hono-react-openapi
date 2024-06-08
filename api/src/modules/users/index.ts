import { defaultHook } from "@/lib/default-hook";
import { errorResponse } from "@/lib/errors";
import { z } from "@/lib/ja-zod";
import { getOrderColumn } from "@/lib/order-column";
import { AppErrorStatusCode } from "@/lib/status-code";
import { usersTable } from "@/schemas/users";
import { CustomHono, type JwtPayload } from "@/types/common";
import { and, count, eq, ilike, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { getUserByIdRouteConfig, getUsersConfig, meRouteConfig, updateUserConfig } from "./routes";
import { userSchema } from "./schemas";

/**
 * ユーザー関連のエンドポイント
 */
const usersRoutes = new CustomHono({ defaultHook })
  /**
   * 自身のユーザー情報
   */
  .openapi(meRouteConfig, async (c) => {
    const { sub } = c.get("jwtPayload") as JwtPayload;

    const db = drizzle(c.env.DB);

    const user = await db.select().from(usersTable).where(eq(usersTable.id, sub)).get();

    if (!user) {
      return errorResponse(c, {
        message: "User not found",
        status: AppErrorStatusCode.NOT_FOUND,
        severity: "warn",
        resourceType: "USER",
        eventData: {
          id: sub,
        },
      });
    }

    return c.json(userSchema.parse(user), 200);
  })
  /**
   * ユーザー情報更新
   */
  .openapi(updateUserConfig, async (c) => {
    const { id: userId } = c.req.valid("param");
    const { sub } = c.get("jwtPayload") as JwtPayload;

    if (sub !== userId) {
      return errorResponse(c, {
        message: "You can only update your own information",
        status: AppErrorStatusCode.FORBIDDEN,
        severity: "warn",
        resourceType: "USER",
        eventData: {
          id: userId,
        },
      });
    }

    const db = drizzle(c.env.DB);

    const { name, email, role } = c.req.valid("json");

    const [updatedUser] = await db
      .update(usersTable)
      .set({
        name,
        email,
        role,
        updatedAt: sql`(CURRENT_TIMESTAMP)`,
      })
      .where(eq(usersTable.id, userId))
      .returning();

    return c.json(userSchema.parse(updatedUser), 200);
  })
  /**
   * ユーザー一覧
   */
  .openapi(getUsersConfig, async (c) => {
    const { q, sort, order, offset, limit, role } = c.req.valid("query");

    const orderColumn = getOrderColumn(
      {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
        role: usersTable.role,
      },
      sort,
      usersTable.id,
      order,
    );

    const filters = [];
    if (q) {
      filters.push(or(ilike(usersTable.name, `%${q}%`), ilike(usersTable.email, `%${q}%`)));
    }
    if (role) {
      filters.push(eq(usersTable.role, role));
    }

    const db = drizzle(c.env.DB);

    const usersQuery = db
      .select()
      .from(usersTable)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(orderColumn);

    const [{ total }] = await db.select({ total: count() }).from(usersQuery.as("users"));

    const result = await usersQuery.limit(Number(limit)).offset(Number(offset));

    const users = z.array(userSchema).parse(result);

    return c.json(
      {
        data: {
          items: users,
          total,
        },
      },
      200,
    );
  })
  /**
   * ユーザーの詳細情報
   */
  .openapi(getUserByIdRouteConfig, async (c) => {
    const id = c.req.param("id");

    const db = drizzle(c.env.DB);

    const user = await db.select().from(usersTable).where(eq(usersTable.id, id)).get();

    if (!user) {
      return errorResponse(c, {
        message: "User not found",
        status: AppErrorStatusCode.NOT_FOUND,
        severity: "warn",
        resourceType: "USER",
        eventData: {
          id,
        },
      });
    }

    return c.json(userSchema.parse(user), 200);
  });

export default usersRoutes;

export type UsersRoutes = typeof usersRoutes;
