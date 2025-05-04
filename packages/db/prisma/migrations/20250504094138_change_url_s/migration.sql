/*
  Warnings:

  - A unique constraint covering the columns `[platform]` on the table `SocialLink` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `SocialLink` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_platform_key" ON "SocialLink"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_url_key" ON "SocialLink"("url");
