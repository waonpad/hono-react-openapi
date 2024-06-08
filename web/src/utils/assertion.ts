/**
 * @see [アサーション関数 (assertion functions) | TypeScript入門『サバイバルTypeScript』](https://typescriptbook.jp/reference/functions/assertion-functions)
 */
// export const とするとエラーになるので、export function としている
export function assertion(condition: unknown, { message }: { message?: string } = {}): asserts condition {
  if (!condition) {
    throw new Error(message ?? "Assertion failed");
  }
}
