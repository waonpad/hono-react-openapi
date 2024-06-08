import i18next from "i18next";
import { type Primitive, z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
// Import your language translation files
import translation from "zod-i18n-map/locales/ja/zod.json";

// lng and resources key depend on your locale.
i18next.init({
  lng: "ja",
  resources: {
    ja: { zod: translation },
  },
});

z.setErrorMap(zodI18nMap);

// export configured zod instance
export { z };

export const isValidZodLiteralUnion = <T extends z.ZodLiteral<unknown>>(literals: T[]): literals is [T, T, ...T[]] =>
  literals.length >= 2;

export function constructZodLiteralUnionType<T extends Primitive>(constArray: readonly T[]) {
  const literalsArray = (constArray.length === 1 ? [constArray[0], constArray[0]] : constArray).map((literal) =>
    z.literal(literal),
  );

  if (!isValidZodLiteralUnion(literalsArray)) {
    throw new Error(
      "Literals passed do not meet the criteria for constructing a union schema, the minimum length is 2",
    );
  }

  return z.union(literalsArray);
}
