/*
  Warnings:

  - You are about to drop the column `conceptLink` on the `question_bank` table. All the data in the column will be lost.
  - Added the required column `concept_link` to the `question_bank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "question_bank" DROP COLUMN "conceptLink",
ADD COLUMN     "concept_link" TEXT NOT NULL;
