-- BodyPart: LEG→하체(LOWER_BODY), CORE→복근(ABS). 신규 OTHER(기타)는 코드에서만 사용.
UPDATE "Exercise" SET "bodyPart" = 'LOWER_BODY' WHERE "bodyPart" = 'LEG';
UPDATE "Exercise" SET "bodyPart" = 'ABS' WHERE "bodyPart" = 'CORE';
