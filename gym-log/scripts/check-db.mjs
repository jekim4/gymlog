/**
 * DB 경로·SQLite 열기 확인 (앱과 동일한 경로 규칙).
 * 사용: gym-log 폴더에서 `node scripts/check-db.mjs`
 */
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

function sqliteDatabasePath() {
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

const dbPath = sqliteDatabasePath();
console.log("cwd:", process.cwd());
console.log("DATABASE_URL:", process.env.DATABASE_URL ?? "(unset, default file:./dev.db)");
console.log("resolved path:", dbPath);

try {
  const db = new Database(dbPath);
  const row = db.prepare("SELECT 1 AS ok").get();
  console.log("SQLite:", row);
  db.close();
  console.log("OK — 이 경로로 앱도 같은 DB를 엽니다.");
} catch (e) {
  console.error("FAILED:", e.message);
  process.exitCode = 1;
}
