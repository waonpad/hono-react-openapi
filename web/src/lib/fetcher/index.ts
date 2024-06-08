import { COOKIE_NAMES } from "@/constants/cookie-names";
import { env } from "@/constants/env";
import { HttpError } from "@/constants/errors";
import { getCookie } from "@/utils/cookie/get-cookie";
import { stringify } from "qs";

export type PathParamsObj = Record<string, string | number>;

export type Options<
  T extends PathParamsObj | undefined = undefined,
  U extends object | undefined = undefined,
  V extends object | undefined = undefined,
> = Omit<RequestInit, "body" | "method"> &
  (T extends PathParamsObj ? { params: T } : { params?: never }) &
  (U extends object ? { searchParams: U } : { searchParams?: never }) &
  (V extends object ? { body: V } : { body?: never });

/** 絶対URLかどうかを判定する　*/
export const isAbsoluteURL = (url: string): boolean => {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};

/** URLとパスを連結する */
export const combineUrls = (baseURL: string, relativeURL: string): string => {
  return relativeURL ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "")}` : baseURL;
};

/** URLを構築する */
export const buildFullPath = (baseURL: string, requestedURL: string): string => {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineUrls(baseURL, requestedURL);
  }
  return requestedURL;
};

/**
 * @param path
 * @example
 * "/users/{id}"
 * @param params
 * @example
 * { id: "1" }
 * @returns
 * "/users/1"
 */
export const replacePathParams = (path: string, params: PathParamsObj): string => {
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replace(`:${key}`, value.toString());
  }, path);
};

/** リクエストヘッダを構築する */
export const buildHeaders = <T = HeadersInit>(headers?: T): HeadersInit => {
  // オブジェクトのキーを全て小文字に変換する
  const lowerCaseHeaders = Object.fromEntries(
    Object.entries(headers ?? {}).map(([key, value]) => [key.toLowerCase(), value]),
  );

  return {
    "content-type": "application/json",
    ...(() => {
      const authToken = getCookie(COOKIE_NAMES.AUTH_TOKEN);

      if (authToken) {
        return { authorization: `bearer ${authToken}` };
      }
    })(),
    ...lowerCaseHeaders,
  };
};

/** リクエストボディを構築する */
export const buildRequestBody = <T = object>(body: T): string | FormData | null => {
  // FormDataの場合、 `JSON.stringify()` せずそのまま返す
  if (body instanceof FormData) return body;

  // bodyがnull,undefinedの場合はnullを返して終了する
  // JSON.stringifyにnullを渡すとエラーになるため
  if (!body) return null;

  return JSON.stringify(body);
};

/** 通信処理を共通化した関数 */
export const http = async <T>(path: string, config: RequestInit): Promise<T> => {
  const request = new Request(buildFullPath(env.VITE_API_URL, path), config);

  const res = await fetch(request);

  if (!res.ok) {
    const data = await res.json();

    const error = new HttpError(data.message ?? "HTTPエラーが発生しました", {
      status: res.status,
      details: data,
    });

    throw error;
  }

  // statusCodeが204のときにres.json()を実行するとエラーになるため
  if ([101, 204, 205, 304].includes(res.status)) return undefined as T;

  return await res.json();
};

/**
 * @type T: レスポンスの型
 * @type U: パスパラメータの型
 * @type V: クエリパラメータの型
 * @type W: リクエストボディの型
 */
export const get = async <
  T,
  U extends PathParamsObj | undefined = undefined,
  V extends object | undefined = undefined,
  _W extends never = never,
>(
  path: string,
  options: Options<U, V, undefined>,
): Promise<T> => {
  return http<T>(
    `${replacePathParams(path, options?.params ?? {})}${stringify(options?.searchParams, { addQueryPrefix: true })}`,
    {
      ...options,
      method: "GET",
      headers: buildHeaders(options?.headers),
    },
  );
};

/**
 * @type T: レスポンスの型
 * @type U: パスパラメータの型
 * @type V: クエリパラメータの型
 * @type W: リクエストボディの型
 */
export const post = async <
  T,
  U extends PathParamsObj | undefined = undefined,
  _V extends never = never,
  W extends object | undefined = undefined,
>(
  path: string,
  options: Options<U, undefined, W>,
): Promise<T> => {
  return http<T>(replacePathParams(path, options?.params ?? {}), {
    ...options,
    method: "POST",
    headers: buildHeaders(options?.headers),
    body: buildRequestBody(options?.body),
  });
};

/**
 * @type T: レスポンスの型
 * @type U: パスパラメータの型
 * @type V: クエリパラメータの型
 * @type W: リクエストボディの型
 */
export const put = async <
  T,
  U extends PathParamsObj | undefined = undefined,
  _V extends never = never,
  W extends object | undefined = undefined,
>(
  path: string,
  options: Options<U, undefined, W>,
): Promise<T> => {
  return http<T>(replacePathParams(path, options?.params ?? {}), {
    ...options,
    method: "PUT",
    body: buildRequestBody(options?.body),
    headers: buildHeaders(options?.headers),
  });
};

export const patch = put;

/**
 * @type T: レスポンスの型
 * @type U: パスパラメータの型
 * @type V: クエリパラメータの型
 * @type W: リクエストボディの型
 */
// deleteはJSの予約語であるためdestroyとする
export const destroy = async <
  T,
  U extends PathParamsObj | undefined = undefined,
  _V extends never = never,
  _W extends never = never,
>(
  path: string,
  options: Options<U, undefined, undefined>,
): Promise<T> => {
  return http(replacePathParams(path, options?.params ?? {}), {
    ...options,
    method: "DELETE",
    headers: buildHeaders(options?.headers),
  });
};
