/**
 * 프리웨이트 기본 종목 시드.
 * gym-log/ 에서 실행: npm run db:seed
 */
import "dotenv/config";
import Database from "better-sqlite3";
import { resolve } from "path";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const dbPath = raw.startsWith("file:") ? resolve(raw.slice(5)) : raw;
const db = new Database(dbPath);

const { n } = db
  .prepare("SELECT COUNT(*) as n FROM Exercise WHERE isSystemDefault = 1")
  .get();

if (n > 0) {
  console.log(`이미 시드됨 (${n}개). 건너뜁니다.`);
  db.close();
  process.exit(0);
}

const insert = db.prepare(
  "INSERT INTO Exercise (id, name, bodyPart, isSystemDefault, createdAt, updatedAt) VALUES (?, ?, ?, 1, ?, ?)",
);
const now = new Date().toISOString();

const exercises = [
  ["ex-chest-1", "벤치프레스", "CHEST"],
  ["ex-chest-2", "인클라인 벤치프레스", "CHEST"],
  ["ex-chest-3", "덤벨 플라이", "CHEST"],
  ["ex-back-1", "데드리프트", "BACK"],
  ["ex-back-2", "바벨 로우", "BACK"],
  ["ex-back-3", "풀업", "BACK"],
  ["ex-back-4", "랫풀다운", "BACK"],
  ["ex-lower-1", "스쿼트", "LOWER_BODY"],
  ["ex-lower-2", "레그프레스", "LOWER_BODY"],
  ["ex-lower-3", "런지", "LOWER_BODY"],
  ["ex-shoulder-1", "오버헤드프레스", "SHOULDER"],
  ["ex-shoulder-2", "사이드 레터럴 레이즈", "SHOULDER"],
  ["ex-arm-1", "바벨 컬", "ARM"],
  ["ex-arm-2", "해머 컬", "ARM"],
  ["ex-arm-3", "트라이셉스 푸시다운", "ARM"],
  ["ex-abs-1", "크런치", "ABS"],
  ["ex-abs-2", "플랭크", "ABS"],
  ["ex-abs-3", "레그레이즈", "ABS"],
];

db.transaction(() => {
  for (const [id, name, bodyPart] of exercises) {
    insert.run(id, name, bodyPart, now, now);
  }
})();

console.log(`${exercises.length}개 종목 시드 완료.`);
db.close();
