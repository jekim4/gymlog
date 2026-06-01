import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

/** Absolute path for better-sqlite3 (adapter strips a single `file:` prefix only). */
function sqliteDatabasePath(): string {
  const raw = process.env.DATABASE_URL?.trim() ?? "file:./dev.db";
  if (raw === ":memory:") return ":memory:";

  if (raw.startsWith("file:")) {
    const afterFile = raw.slice("file:".length);
    if (afterFile.startsWith("./") || afterFile.startsWith("../")) {
      return path.resolve(process.cwd(), afterFile);
    }
    try {
      return fileURLToPath(new URL(raw));
    } catch {
      return path.resolve(process.cwd(), afterFile.replace(/^\/+/, ""));
    }
  }

  return path.resolve(process.cwd(), raw);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: sqliteDatabasePath() });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
