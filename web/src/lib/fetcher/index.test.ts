import { describe, expect, it, vi } from "vitest";
import { buildFullPath, buildHeaders, combineUrls, isAbsoluteURL, replacePathParams } from ".";

const token = "token";

const { getCookie } = vi.hoisted(() => {
  return {
    getCookie: vi.fn(() => token as string | null),
  };
});

vi.mock("@/utils/cookie/get-cookie", () => {
  return {
    getCookie: getCookie,
  };
});

describe("isAbsoluteURL", () => {
  it("絶対URLの場合、trueを返す", () => {
    const result = isAbsoluteURL("https://example.com");

    expect(result).toBe(true);
  });

  it("相対URLの場合、falseを返す", () => {
    const result = isAbsoluteURL("/api/test");

    expect(result).toBe(false);
  });
});

describe("combineUrls", () => {
  it("baseURLが空の場合、relativeURLをそのまま返す", () => {
    const result = combineUrls("", "/api/test");

    expect(result).toBe("/api/test");
  });

  it("relativeURLが空の場合、baseURLをそのまま返す", () => {
    const result = combineUrls("https://example.com", "");

    expect(result).toBe("https://example.com");
  });

  it("baseURL, relativeURLが共に空の場合、空文字を返す", () => {
    const result = combineUrls("", "");

    expect(result).toBe("");
  });

  it("baseURL, relativeURLが共に空でない場合、連結して返す", () => {
    const result = combineUrls("https://example.com", "/api/test");

    expect(result).toBe("https://example.com/api/test");
  });

  it("baseURLがスラッシュで終わり、relativeURLがスラッシュで始まる場合、スラッシュを1つにして返す", () => {
    const result = combineUrls("https://example.com/", "/api/test");

    expect(result).toBe("https://example.com/api/test");
  });
});

describe("buildFullPath", () => {
  it("baseURLが空の場合、requestedURLをそのまま返す", () => {
    const result = buildFullPath("", "/api/test");

    expect(result).toBe("/api/test");
  });

  it("requestedURLが絶対URLの場合、そのまま返す", () => {
    const result = buildFullPath("https://example.com", "https://example.com/api/test");

    expect(result).toBe("https://example.com/api/test");
  });

  it("baseURL, requestedURLが共に空の場合、空文字を返す", () => {
    const result = buildFullPath("", "");

    expect(result).toBe("");
  });

  it("baseURL, requestedURLが共に空でない場合、連結して返す", () => {
    const result = buildFullPath("https://example.com", "/api/test");

    expect(result).toBe("https://example.com/api/test");
  });
});

describe("replacePathParams", () => {
  it("パスパラメータを正しく置換できる", () => {
    const result = replacePathParams("/users/:id", { id: "1" });

    expect(result).toBe("/users/1");
  });
});

describe("buildHeaders", () => {
  it("Content-Typeがapplication/jsonである", () => {
    const result = buildHeaders();

    expect(result).toHaveProperty("content-type", "application/json");
  });

  it("Authorizationヘッダが存在する", () => {
    const result = buildHeaders();

    expect(result).toHaveProperty("authorization", `bearer ${token}`);
  });

  it("Authorizationヘッダが存在しない", () => {
    getCookie.mockImplementationOnce(() => null);

    const result = buildHeaders();

    expect(result).not.toHaveProperty("authorization");
  });

  it("Content-Typeが上書きされる", () => {
    const result = buildHeaders({ "content-type": "text/plain" });

    expect(result).toHaveProperty("content-type", "text/plain");
  });

  it("大文字小文字の表記揺れを吸収する", () => {
    const result = buildHeaders({ "Content-Type": "text/plain" });

    expect(result).toHaveProperty("content-type", "text/plain");
  });
});
