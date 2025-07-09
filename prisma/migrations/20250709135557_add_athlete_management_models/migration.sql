-- CreateEnum
CREATE TYPE "ClubRole" AS ENUM ('MEMBER', 'ADMIN', 'OWNER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" VARCHAR(50),
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" VARCHAR(255) NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_clubs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "role" "ClubRole" NOT NULL DEFAULT 'MEMBER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genders" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(8) NOT NULL,
    "initial" VARCHAR(1) NOT NULL,

    CONSTRAINT "genders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "age_groups" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "age_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athletes" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "genderId" TEXT NOT NULL,
    "firstName" VARCHAR(64) NOT NULL,
    "lastName" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ageGroupId" TEXT,

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE INDEX "accounts_provider_idx" ON "accounts"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_sessionToken_idx" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_expires_idx" ON "sessions"("expires");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE INDEX "verification_tokens_identifier_idx" ON "verification_tokens"("identifier");

-- CreateIndex
CREATE INDEX "verification_tokens_token_idx" ON "verification_tokens"("token");

-- CreateIndex
CREATE INDEX "verification_tokens_expires_idx" ON "verification_tokens"("expires");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_name_key" ON "clubs"("name");

-- CreateIndex
CREATE INDEX "clubs_name_idx" ON "clubs"("name");

-- CreateIndex
CREATE INDEX "clubs_isActive_idx" ON "clubs"("isActive");

-- CreateIndex
CREATE INDEX "clubs_isActive_createdAt_idx" ON "clubs"("isActive", "createdAt");

-- CreateIndex
CREATE INDEX "user_clubs_userId_idx" ON "user_clubs"("userId");

-- CreateIndex
CREATE INDEX "user_clubs_clubId_idx" ON "user_clubs"("clubId");

-- CreateIndex
CREATE INDEX "user_clubs_userId_isActive_idx" ON "user_clubs"("userId", "isActive");

-- CreateIndex
CREATE INDEX "user_clubs_clubId_isActive_idx" ON "user_clubs"("clubId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "user_clubs_userId_clubId_key" ON "user_clubs"("userId", "clubId");

-- CreateIndex
CREATE UNIQUE INDEX "genders_name_key" ON "genders"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genders_initial_key" ON "genders"("initial");

-- CreateIndex
CREATE INDEX "genders_name_idx" ON "genders"("name");

-- CreateIndex
CREATE INDEX "genders_initial_idx" ON "genders"("initial");

-- CreateIndex
CREATE INDEX "age_groups_clubId_idx" ON "age_groups"("clubId");

-- CreateIndex
CREATE INDEX "age_groups_clubId_ordinal_idx" ON "age_groups"("clubId", "ordinal");

-- CreateIndex
CREATE INDEX "age_groups_ordinal_idx" ON "age_groups"("ordinal");

-- CreateIndex
CREATE UNIQUE INDEX "age_groups_clubId_name_key" ON "age_groups"("clubId", "name");

-- CreateIndex
CREATE INDEX "athletes_clubId_idx" ON "athletes"("clubId");

-- CreateIndex
CREATE INDEX "athletes_genderId_idx" ON "athletes"("genderId");

-- CreateIndex
CREATE INDEX "athletes_ageGroupId_idx" ON "athletes"("ageGroupId");

-- CreateIndex
CREATE INDEX "athletes_clubId_firstName_idx" ON "athletes"("clubId", "firstName");

-- CreateIndex
CREATE INDEX "athletes_clubId_lastName_idx" ON "athletes"("clubId", "lastName");

-- CreateIndex
CREATE INDEX "athletes_clubId_firstName_lastName_idx" ON "athletes"("clubId", "firstName", "lastName");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_clubId_firstName_lastName_key" ON "athletes"("clubId", "firstName", "lastName");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_clubs" ADD CONSTRAINT "user_clubs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_clubs" ADD CONSTRAINT "user_clubs_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "age_groups" ADD CONSTRAINT "age_groups_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "genders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_ageGroupId_fkey" FOREIGN KEY ("ageGroupId") REFERENCES "age_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
