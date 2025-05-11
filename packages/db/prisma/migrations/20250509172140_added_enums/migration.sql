/*
  Warnings:

  - Changed the type of `difficulty` on the `QuestionBank` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tags` on the `QuestionBank` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `language` on the `Solution` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `tags` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `preferredLanguages` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('PYTHON', 'JAVASCRIPT');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "Tags" AS ENUM ('Binary_Search', 'Array', 'Hashing', 'Two_Pointers', 'Sliding_Window', 'Heap');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "LosserId" TEXT,
ADD COLUMN     "losReason" TEXT;

-- AlterTable
ALTER TABLE "QuestionBank" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL,
DROP COLUMN "tags",
ADD COLUMN     "tags" "Tags" NOT NULL;

-- AlterTable
ALTER TABLE "Solution" DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tags" "Tags" NOT NULL,
DROP COLUMN "preferredLanguages",
ADD COLUMN     "preferredLanguages" "Language" NOT NULL;
