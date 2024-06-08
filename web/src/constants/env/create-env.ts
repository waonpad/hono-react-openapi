import { createEnv as createT3Env } from "@t3-oss/env-core";
import { z } from "zod";

export const createEnv = ({ runtimeEnv }: { runtimeEnv: NodeJS.ProcessEnv }) => {
  return createT3Env({
    server: {},
    clientPrefix: "VITE_",
    client: {
      VITE_APP_ENV: z.enum(["dev", "prod", "test", "ci"]),
      VITE_APP_NAME: z.string().min(1),
      VITE_API_URL: z.string().url(),
    },
    runtimeEnv: runtimeEnv,
    emptyStringAsUndefined: true,
  });
};
