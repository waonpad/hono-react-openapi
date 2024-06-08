export type HttpErrorType<T = unknown> = {
  name: "HttpError";
  status: number;
  message: string;
  // これより下のプロパティはプロジェクトのエラーがどういう形式かによる
  details?: T;
  toJSON(): HttpErrorType<T>;
};

export class HttpError extends Error {
  status: HttpErrorType["status"];

  details: HttpErrorType["details"];

  constructor(message: HttpErrorType["message"], { status, details }: Pick<HttpErrorType, "status" | "details">) {
    super(message);
    this.name = "HttpError";
    this.status = status || 500;
    this.details = details;
  }

  toJSON(): HttpErrorType {
    const result = {};
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.getOwnPropertyNames(this).forEach((key) => {
      // @ts-ignore
      result[key] = this[key];
    });
    return result as HttpErrorType;
  }
}
