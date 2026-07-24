#!/bin/sh
set -e

echo "▶ DB 마이그레이션..."
node_modules/.bin/prisma migrate deploy

echo "▶ 시드 데이터 확인..."
node prisma/seed.mjs

echo "▶ GymLog 시작!"
exec npm start
