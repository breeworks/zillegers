/*
  Warnings:

  - You are about to drop the column `authorId` on the `question_bank` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `question_bank` table. All the data in the column will be lost.
  - You are about to drop the column `expectedSpaceComplexity` on the `question_bank` table. All the data in the column will be lost.
  - You are about to drop the column `expectedTimeComplexity` on the `question_bank` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `question_bank` table. All the data in the column will be lost.
  - You are about to drop the column `testCases` on the `question_bank` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `question_bank` table. All the data in the column will be lost.
  - Added the required column `expected_space_complexity` to the `question_bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expected_time_complexity` to the `question_bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_cases` to the `question_bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `question_bank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "question_bank" DROP COLUMN "authorId",
DROP COLUMN "createdAt",
DROP COLUMN "expectedSpaceComplexity",
DROP COLUMN "expectedTimeComplexity",
DROP COLUMN "isActive",
DROP COLUMN "testCases",
DROP COLUMN "updatedAt",
ADD COLUMN     "author_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expected_space_complexity" TEXT NOT NULL,
ADD COLUMN     "expected_time_complexity" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "test_cases" JSONB NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
