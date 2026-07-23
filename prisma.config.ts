import { config as loadEnvironment } from "dotenv";
import { defineConfig, env } from "prisma/config";

loadEnvironment({
  path: [".env.local", ".env"],
  override: false,
  quiet: true,
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  datasource: {
    // Migration commands must use the non-pooled connection.
    url: env("DIRECT_URL"),
  },
});
