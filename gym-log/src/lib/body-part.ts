import type { BodyPart } from "@/generated/prisma/enums";

/** 화면·탭 표시 순서: 가슴 / 등 / 하체 / 어깨 / 팔 / 복근 / 기타 */
export const BODY_PART_ORDER: readonly BodyPart[] = [
  "CHEST",
  "BACK",
  "LOWER_BODY",
  "SHOULDER",
  "ARM",
  "ABS",
  "OTHER",
] as const;

export const BODY_PART_LABEL: Record<BodyPart, string> = {
  CHEST: "가슴",
  BACK: "등",
  LOWER_BODY: "하체",
  SHOULDER: "어깨",
  ARM: "팔",
  ABS: "복근",
  OTHER: "기타",
};
