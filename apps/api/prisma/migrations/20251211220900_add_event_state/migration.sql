-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizerSig" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'DRAFT',
    "heroTitle" TEXT NOT NULL,
    "heroTagsCsv" TEXT NOT NULL,
    "regEnabled" BOOLEAN NOT NULL DEFAULT true,
    "regTitle" TEXT NOT NULL,
    "regDescription" TEXT NOT NULL,
    "regButtonText" TEXT NOT NULL,
    "aboutMarkdown" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "locationDesc" TEXT NOT NULL,
    "mapEmbedUrl" TEXT NOT NULL,
    "mapTitle" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" JSONB NOT NULL,
    "form" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("aboutMarkdown", "createdAt", "date", "form", "heroTagsCsv", "heroTitle", "id", "locationDesc", "locationName", "mapEmbedUrl", "mapTitle", "organizerSig", "regButtonText", "regDescription", "regEnabled", "regTitle", "time", "updatedAt") SELECT "aboutMarkdown", "createdAt", "date", "form", "heroTagsCsv", "heroTitle", "id", "locationDesc", "locationName", "mapEmbedUrl", "mapTitle", "organizerSig", "regButtonText", "regDescription", "regEnabled", "regTitle", "time", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

