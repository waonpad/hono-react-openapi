# Hono React OpenAPI
**Hono と React を使用し、バックエンドのコードファーストなスキーマ駆動開発をするサンプル**  

HonoのRPCはここでは敢えて使わない

## 構成
- 全体
  - Bun
  - TypeScript
  - Biome
  - Zod
  - OpenAPI

- フロントエンド
  - Vite
  - React
  - React Router
  - React Hook Form
  - TanStack Query
  - T3 Env
  - Vitest

- バックエンド
  - Hono
  - Cloudflare Workers
  - Drizzle
  - JWT Auth

## セットアップ

Bun をインストール
```bash
curl -fsSL https://bun.sh/install | bash
```

セットアップコマンドを実行
```bash
bun setup
```

https://generate-secret.vercel.app/32 にアクセスし、シークレットキーを取得

```toml
# /api/wrangler.toml

[vars]
...
JWT_SECRET = <シークレットキーを貼り付け>
```

ローカルで使用するsqliteファイルを生成する  
一度データベースにアクセスする処理を行う必要があるため、サーバーを起動する
```bash
cd api && bun dev
```

適当なエンドポイントにアクセスする
```bash
curl http://localhost:8787/users
```

テーブルを作る
```bash
cd api && bun run db:push:dev
# シーディングまでする場合
# cd api && bun db:seed:dev
```

## 開発
フロントとバックを別ターミナルで開き、それぞれのディレクトリでサーバーを起動
```bash
# フロント
cd web && bun dev
# バック
cd api && bun dev
```

Open API仕様を確認するには、http://localhost:8787/doc にアクセスする  

API仕様をファイルに出力し、フロントでzodスキーマを生成する
```bash
bun run oapi
# 出力のみ
# bun run oapi:gen
# スキーマ生成のみ
# bun run oapi:push
```
