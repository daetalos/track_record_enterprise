-- CreateTable
CREATE TABLE "seasons" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplines" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" TEXT,
    "isTimed" BOOLEAN NOT NULL DEFAULT false,
    "isMeasured" BOOLEAN NOT NULL DEFAULT false,
    "isSmallerBetter" BOOLEAN NOT NULL DEFAULT false,
    "teamSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seasons_name_key" ON "seasons"("name");

-- CreateIndex
CREATE INDEX "seasons_name_idx" ON "seasons"("name");

-- CreateIndex
CREATE INDEX "disciplines_seasonId_idx" ON "disciplines"("seasonId");

-- CreateIndex
CREATE INDEX "disciplines_seasonId_name_idx" ON "disciplines"("seasonId", "name");

-- CreateIndex
CREATE INDEX "disciplines_isTimed_idx" ON "disciplines"("isTimed");

-- CreateIndex
CREATE INDEX "disciplines_isMeasured_idx" ON "disciplines"("isMeasured");

-- CreateIndex
CREATE UNIQUE INDEX "disciplines_seasonId_name_key" ON "disciplines"("seasonId", "name");

-- AddForeignKey
ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
