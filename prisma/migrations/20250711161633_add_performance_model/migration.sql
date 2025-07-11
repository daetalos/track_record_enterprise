-- CreateTable
CREATE TABLE "medals" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "name" VARCHAR(16) NOT NULL,

    CONSTRAINT "medals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performances" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "ageGroupId" TEXT NOT NULL,
    "genderId" TEXT NOT NULL,
    "medalId" TEXT,
    "timeSeconds" DOUBLE PRECISION,
    "distanceMeters" DOUBLE PRECISION,
    "date" DATE NOT NULL,
    "eventDetails" VARCHAR(255) NOT NULL,
    "isPersonalBest" BOOLEAN NOT NULL DEFAULT false,
    "isClubRecord" BOOLEAN NOT NULL DEFAULT false,
    "wasPersonalBest" BOOLEAN NOT NULL DEFAULT false,
    "wasClubRecord" BOOLEAN NOT NULL DEFAULT false,
    "proofFileUrl" VARCHAR(500),
    "proofFileName" VARCHAR(255),
    "teamMembers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medals_position_key" ON "medals"("position");

-- CreateIndex
CREATE INDEX "medals_position_idx" ON "medals"("position");

-- CreateIndex
CREATE INDEX "performances_athleteId_idx" ON "performances"("athleteId");

-- CreateIndex
CREATE INDEX "performances_disciplineId_idx" ON "performances"("disciplineId");

-- CreateIndex
CREATE INDEX "performances_ageGroupId_idx" ON "performances"("ageGroupId");

-- CreateIndex
CREATE INDEX "performances_genderId_idx" ON "performances"("genderId");

-- CreateIndex
CREATE INDEX "performances_medalId_idx" ON "performances"("medalId");

-- CreateIndex
CREATE INDEX "performances_date_idx" ON "performances"("date");

-- CreateIndex
CREATE INDEX "performances_isPersonalBest_idx" ON "performances"("isPersonalBest");

-- CreateIndex
CREATE INDEX "performances_isClubRecord_idx" ON "performances"("isClubRecord");

-- CreateIndex
CREATE INDEX "performances_athleteId_disciplineId_idx" ON "performances"("athleteId", "disciplineId");

-- CreateIndex
CREATE INDEX "performances_disciplineId_ageGroupId_genderId_idx" ON "performances"("disciplineId", "ageGroupId", "genderId");

-- CreateIndex
CREATE INDEX "performances_date_disciplineId_idx" ON "performances"("date", "disciplineId");

-- CreateIndex
CREATE UNIQUE INDEX "performances_athleteId_disciplineId_ageGroupId_genderId_dat_key" ON "performances"("athleteId", "disciplineId", "ageGroupId", "genderId", "date", "eventDetails");

-- AddForeignKey
ALTER TABLE "performances" ADD CONSTRAINT "performances_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performances" ADD CONSTRAINT "performances_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performances" ADD CONSTRAINT "performances_ageGroupId_fkey" FOREIGN KEY ("ageGroupId") REFERENCES "age_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performances" ADD CONSTRAINT "performances_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "genders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performances" ADD CONSTRAINT "performances_medalId_fkey" FOREIGN KEY ("medalId") REFERENCES "medals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
