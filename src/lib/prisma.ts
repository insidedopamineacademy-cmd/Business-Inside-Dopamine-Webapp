import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { getDatabaseConfiguration } from "@/lib/env";

declare global {
  var __prisma: PrismaClient | undefined;
}

let prismaClient = global.__prisma;

function createPrismaClient() {
  const { databaseUrl } = getDatabaseConfiguration();
  const adapter = new PrismaPg({
    connectionString: databaseUrl,
    // Preserve Prisma 6's bounded connection-attempt behavior.
    connectionTimeoutMillis: 5_000,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : [],
  });
}

function getPrismaClient() {
  if (prismaClient) return prismaClient;

  prismaClient = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    global.__prisma = prismaClient;
  }
  return prismaClient;
}

// Prisma 7 driver adapters require a connection string at construction time.
// Keep module imports side-effect free and initialize the existing singleton
// only when a database delegate or client method is actually used.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
