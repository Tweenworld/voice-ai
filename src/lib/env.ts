import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().min(1),
        DIRECT_URL: z.string().min(1),
    },
    experimental__runtimeEnv: {},
    skipValidation: !!(
        globalThis as typeof globalThis & {
            process?: { env?: { SKIP_ENV_VALIDATION?: string } };
        }
    ).process?.env?.SKIP_ENV_VALIDATION,
});