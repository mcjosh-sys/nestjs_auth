/*
  Warnings:

  - You are about to drop the column `hashedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hashedRt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "hashedAt",
DROP COLUMN "hashedRt",
ADD COLUMN     "hashedAccessToken" TEXT,
ADD COLUMN     "hashedRefreshToken" TEXT;
