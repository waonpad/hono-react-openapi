import { Hono } from "hono";
import type { FC } from "hono/jsx";

const Layout: FC = (props) => {
  return (
    <html lang="ja">
      <body>{props.children}</body>
    </html>
  );
};

const Top: FC<{ messages: string[] }> = (props: { messages: string[] }) => {
  return (
    <Layout>
      <h1>Hello Hono!</h1>
      <ul>
        {props.messages.map((message, index) => {
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          return <li key={index}>{message}!!</li>;
        })}
      </ul>
    </Layout>
  );
};

export const jsxRoutes = new Hono().get("/jsx", (c) => {
  const messages = ["Good Morning", "Good Evening", "Good Night"];
  return c.html(<Top messages={messages} />);
});
