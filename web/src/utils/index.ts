type Entries<T> = (keyof T extends infer U ? (U extends keyof T ? [U, T[U]] : never) : never)[];

export const getEntries = <T extends Record<string, unknown>>(obj: T): Entries<T> => {
  return Object.entries(obj) as Entries<T>;
};
