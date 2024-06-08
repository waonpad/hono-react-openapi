import { hashPassword, verifyPassword } from "@/lib/crypto";
import { defaultHook } from "@/lib/default-hook";
import { errorResponse } from "@/lib/errors";
import { AppErrorStatusCode } from "@/lib/status-code";
import { usersTable } from "@/schemas/users";
import { CustomHono } from "@/types/common";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { sign } from "hono/jwt";
import { userSchema } from "../users/schemas";
import { signInRouteConfig, signUpRouteConfig } from "./routes";
import type { jwtPayloadSchema } from "./schemas";

/**
 * 認証関連のエンドポイント
 */
const authRoutes = new CustomHono({ defaultHook })
  /**
   * サインアップ
   */
  .openapi(signUpRouteConfig, async (c) => {
    const { name, email, password } = c.req.valid("json");

    const db = drizzle(c.env.DB);

    const hashedPassword = await hashPassword(password);

    const isExistsSameEmail = (await db.select().from(usersTable).where(eq(usersTable.email, email))).length > 0;

    if (isExistsSameEmail) {
      return errorResponse(c, {
        message: "User already exists",
        status: AppErrorStatusCode.BAD_REQUEST,
        severity: "warn",
      });
    }

    const [createdUser] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        hashedPassword,
      })
      .returning();

    const payload: typeof jwtPayloadSchema._type = {
      sub: createdUser.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 5,
    };

    const token = await sign(payload, c.env.JWT_SECRET);

    return c.json({ user: userSchema.parse(createdUser), token }, 200);
  })
  /**
   * サインイン
   */
  .openapi(signInRouteConfig, async (c) => {
    const { email, password } = c.req.valid("json");

    const db = drizzle(c.env.DB);

    const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).get();

    if (!user) {
      return errorResponse(c, {
        message: "Invalid email or password",
        status: AppErrorStatusCode.BAD_REQUEST,
        severity: "warn",
      });
    }

    if (!(await verifyPassword(user.hashedPassword, password))) {
      return errorResponse(c, {
        message: "Invalid email or password",
        status: AppErrorStatusCode.BAD_REQUEST,
        severity: "warn",
      });
    }

    const payload: typeof jwtPayloadSchema._type = {
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 5,
    };

    const token = await sign(payload, c.env.JWT_SECRET);

    return c.json({ user: userSchema.parse(user), token }, 200);
  });

export default authRoutes;

export type AuthRoutes = typeof authRoutes;
