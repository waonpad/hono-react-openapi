import { swaggerUI } from "@hono/swagger-ui";
import { bearerAuth } from "hono/bearer-auth";
import type { CustomHono } from "../types/common";

/**
 * Open APIドキュメント関連の設定
 */
export const docs = (app: CustomHono) => {
  app
    /**
     * ドキュメントそのものにはBearer認証を適用
     */
    .use(
      "/specification",
      bearerAuth({
        token: "bearer-token",
      }),
    );
  /**
   * swagger-uiにはBasic認証を適用
   * onErrorでおかしくなるのでいったん無効
   */
  // .use(
  //   "/doc",
  //   basicAuth({
  //     username: "user",
  //     password: "password",
  //   })
  // );

  app
    /**
     * openapiドキュメントそのもの
     */
    .doc31("/specification", (c) => ({
      openapi: "3.1.0",
      info: {
        title: "API",
        version: "1.0.0",
      },
      servers: [
        {
          url: new URL(c.req.url).origin,
          description: "Current environment",
        },
      ],
    }))
    /**
     * swagger-ui \
     * ドキュメントにアクセスする際にBearer認証を適用
     */
    .get(
      "/doc",
      swaggerUI({
        url: "/specification",
        requestInterceptor: `
        request => {
          if (request.url === '/specification') {
            request.headers['authorization'] = \`Bearer bearer-token\`;
          }
          return request;
        }
      `,
      }),
    );

  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
  });
};
