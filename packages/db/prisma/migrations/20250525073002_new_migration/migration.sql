-- CreateEnum
CREATE TYPE "Language" AS ENUM ('PYTHON', 'JAVASCRIPT', 'JAVA', 'CPP', 'C', 'TYPESCRIPT');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "Tags" AS ENUM ('BINARY_SEARCH', 'ARRAY', 'HASHING', 'TWO_POINTERS', 'SLIDING_WINDOW', 'HEAP', 'DYNAMIC_PROGRAMMING', 'GREEDY', 'BACKTRACKING', 'TREE', 'GRAPH', 'LINKED_LIST', 'STACK', 'QUEUE', 'STRING', 'MATH', 'BIT_MANIPULATION', 'SORTING', 'SEARCHING');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('GITHUB', 'LINKEDIN', 'TWITTER', 'DISCORD', 'WEBSITE');

-- CreateEnum
CREATE TYPE "Badge" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'CHAMPION');

-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('WAITING', 'FULL', 'IN_MATCH', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('WAITING', 'ACTIVE', 'COMPLETED', 'ABANDONED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WinReason" AS ENUM ('FASTER_SOLUTION', 'CORRECT_SOLUTION', 'BETTER_COMPLEXITY', 'OPPONENT_TIMEOUT', 'OPPONENT_DISCONNECT');

-- CreateEnum
CREATE TYPE "LossReason" AS ENUM ('SLOWER_SOLUTION', 'INCORRECT_SOLUTION', 'WORSE_COMPLEXITY', 'TIMEOUT', 'DISCONNECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "isverified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedCode" INTEGER,
    "verifiedCodeExpireTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferredLanguages" "Language"[],
    "tags" "Tags"[],
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_bank" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "solution" TEXT NOT NULL,
    "conceptLink" TEXT NOT NULL,
    "tags" "Tags"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "testCases" JSONB NOT NULL,
    "expectedTimeComplexity" TEXT NOT NULL,
    "expectedSpaceComplexity" TEXT NOT NULL,
    "hints" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT,
    "constraints" TEXT,
    "examples" JSONB,

    CONSTRAINT "question_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboards" (
    "id" TEXT NOT NULL,
    "rank" INTEGER,
    "badge" "Badge",
    "winCount" INTEGER NOT NULL DEFAULT 0,
    "lossCount" INTEGER NOT NULL DEFAULT 0,
    "aiLifeline" INTEGER NOT NULL DEFAULT 3,
    "userId" TEXT NOT NULL,
    "totalMatches" INTEGER NOT NULL DEFAULT 0,
    "averageSolveTime" DOUBLE PRECISION,
    "fastestSolve" DOUBLE PRECISION,
    "rating" INTEGER NOT NULL DEFAULT 1000,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaderboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "joinCode" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireAt" TIMESTAMP(3),
    "status" "TeamStatus" NOT NULL DEFAULT 'WAITING',
    "playerOneId" TEXT NOT NULL,
    "playerTwoId" TEXT,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "status" "MatchStatus" NOT NULL DEFAULT 'WAITING',
    "teamId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "winnerId" TEXT,
    "winReason" "WinReason",
    "loserId" TEXT,
    "lossReason" "LossReason",
    "timeLimit" INTEGER NOT NULL DEFAULT 1800,
    "allowHints" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solutions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executionTime" DOUBLE PRECISION,
    "memoryUsed" DOUBLE PRECISION,
    "passedTests" INTEGER NOT NULL DEFAULT 0,
    "totalTests" INTEGER NOT NULL DEFAULT 0,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeComplexity" TEXT,
    "spaceComplexity" TEXT,
    "testResults" JSONB,

    CONSTRAINT "solutions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "social_links_userId_platform_key" ON "social_links"("userId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "question_bank_title_key" ON "question_bank"("title");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboards_userId_key" ON "leaderboards"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_joinCode_key" ON "teams"("joinCode");

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_playerOneId_fkey" FOREIGN KEY ("playerOneId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question_bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
