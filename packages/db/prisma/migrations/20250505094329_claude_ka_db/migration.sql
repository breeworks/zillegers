/*
  Warnings:

  - You are about to drop the column `VerifiedCodeExpireTime` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `QuestionBank` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,platform]` on the table `SocialLink` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expectedSpaceComplexity` to the `QuestionBank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedTimeComplexity` to the `QuestionBank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testCases` to the `QuestionBank` table without a default value. This is not possible if the table is not empty.
  - Made the column `isverified` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "SocialLink_platform_key";

-- DropIndex
DROP INDEX "SocialLink_url_key";

-- AlterTable
ALTER TABLE "LeaderBoard" ADD COLUMN     "averageSolveTime" DOUBLE PRECISION,
ADD COLUMN     "fastestSolve" DOUBLE PRECISION,
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "totalMatches" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "QuestionBank" ADD COLUMN     "expectedSpaceComplexity" TEXT NOT NULL,
ADD COLUMN     "expectedTimeComplexity" TEXT NOT NULL,
ADD COLUMN     "hints" TEXT[],
ADD COLUMN     "testCases" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "VerifiedCodeExpireTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "preferredLanguages" TEXT[],
ADD COLUMN     "verifiedCodeExpireTime" TIMESTAMP(3),
ALTER COLUMN "isverified" SET NOT NULL;

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "joinCode" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireAt" TIMESTAMP(3),
    "playerOneId" TEXT NOT NULL,
    "playerTwoId" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "teamId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "winnerId" TEXT,
    "winReason" TEXT,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solution" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executionTime" DOUBLE PRECISION,
    "memoryUsed" DOUBLE PRECISION,
    "passedTests" INTEGER NOT NULL DEFAULT 0,
    "totalTests" INTEGER NOT NULL DEFAULT 0,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeComplexity" TEXT,
    "spaceComplexity" TEXT,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_joinCode_key" ON "Team"("joinCode");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionBank_title_key" ON "QuestionBank"("title");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_userId_platform_key" ON "SocialLink"("userId", "platform");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_playerOneId_fkey" FOREIGN KEY ("playerOneId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuestionBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
