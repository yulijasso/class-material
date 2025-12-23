-- CreateTable
CREATE TABLE "CourseSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseSection_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,
    "sectionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseFile_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseFile_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "CourseSection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CourseFile" ("courseId", "createdAt", "fileName", "fileSize", "fileType", "fileUrl", "id", "title") SELECT "courseId", "createdAt", "fileName", "fileSize", "fileType", "fileUrl", "id", "title" FROM "CourseFile";
DROP TABLE "CourseFile";
ALTER TABLE "new_CourseFile" RENAME TO "CourseFile";
CREATE TABLE "new_CourseNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "sectionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseNote_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseNote_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "CourseSection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CourseNote" ("content", "courseId", "createdAt", "id", "title", "updatedAt") SELECT "content", "courseId", "createdAt", "id", "title", "updatedAt" FROM "CourseNote";
DROP TABLE "CourseNote";
ALTER TABLE "new_CourseNote" RENAME TO "CourseNote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
